import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  
  displayedColumns: string[] = ['image', 'name', 'category', 'price', 'stock', 'status', 'createdAt', 'actions'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    
    // Build query parameters for backend filtering
    const params: any = {};
    
    if (this.searchTerm && this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }
    
    if (this.selectedCategory) {
      params.categoryId = this.selectedCategory;
    }
    
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }
    
    // Use admin products API with backend filtering
    this.productService.getAdminProducts(params).subscribe({
      next: (response: any) => {
        this.products = response.products || [];
        this.filteredProducts = [...this.products]; // No need for frontend filtering anymore
        console.log('this.products', this.products);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading admin products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.categories = response.categories || [];
      },
      (error: any) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  applyFilter() {
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Add debouncing for better performance
    this.searchTimeout = setTimeout(() => {
      this.loadProducts();
    }, 300);
  }

  toggleProductStatus(product: any) {
    this.productService.toggleProductStatus(product._id).subscribe(
      (response: any) => {
        this.loadProducts();
      },
      (error: any) => {
        console.error('Error toggling product status:', error);
      }
    );
  }

  deleteProduct(product: any) {
    if (confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe(
        (response: any) => {
          this.loadProducts();
        },
        (error: any) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  getProductImageUrl(product: any): string {
    // Check for imageUrls array first
    if (product.imageUrls && product.imageUrls.length > 0) {
      const imageUrl = product.imageUrls[0];
      return imageUrl.startsWith('http') 
        ? imageUrl 
        : `http://localhost:3000${imageUrl}`;
    }
    
    // Fallback to imageUrl
    if (product.imageUrl) {
      return product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `http://localhost:3000${product.imageUrl}`;
    }
    
    // Default placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openEditDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  private searchTimeout: any;
}
