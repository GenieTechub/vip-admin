import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ChipModule,
    ProgressSpinnerModule,
    TooltipModule,
    DialogModule,
    FloatLabelModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory: any = '';
  selectedSubcategory: any = '';
  selectedStatus: any = '';
  subcategoryFilter: any = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Check for subcategory filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['subcategoryId']) {
        this.subcategoryFilter = {
          id: params['subcategoryId'],
          name: params['subcategoryName'] || 'Selected Subcategory'
        };
        this.selectedSubcategory = params['subcategoryId'];
      }
    });
    
    this.loadProducts();
    this.loadCategories();
    this.loadSubcategories();
  }

  loadProducts(): void {
    this.loading = true;

    const params: any = {};
    if (this.searchTerm && this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }
    if (this.selectedCategory) {
      params.categoryId = this.selectedCategory;
    }
    if (this.selectedSubcategory) {
      params.subcategoryId = this.selectedSubcategory;
    }
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    // If we have a subcategory filter, use the subcategory products endpoint
    if (this.selectedSubcategory) {
      this.subcategoryService.getSubcategoryProducts(this.selectedSubcategory, params).subscribe({
        next: (response: any) => {
          this.products = response.products || [];
          this.filteredProducts = [...this.products];
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading subcategory products:', error);
          this.loading = false;
        }
      });
    } else {
      this.productService.getAdminProducts(params).subscribe({
        next: (response: any) => {
          this.products = response.products || [];
          this.filteredProducts = [...this.products];
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading admin products:', error);
          this.loading = false;
        }
      });
    }
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

  loadSubcategories() {
    this.subcategoryService.getSubcategories().subscribe(
      (response: any) => {
        this.subcategories = response.subcategories || [];
      },
      (error: any) => {
        console.error('Error loading subcategories:', error);
      }
    );
  }

  onCategoryChange() {
    // Reset subcategory when category changes
    this.selectedSubcategory = '';
    this.subcategoryFilter = null;
    this.loadProducts();
  }

  onSubcategoryChange() {
    this.subcategoryFilter = this.selectedSubcategory ? 
      this.subcategories.find(s => s.id === this.selectedSubcategory) : null;
    this.loadProducts();
  }

  clearSubcategoryFilter() {
    this.selectedSubcategory = '';
    this.subcategoryFilter = null;
    this.router.navigate(['/products']);
  }

  applyFilter() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadProducts();
    }, 300);
  }

  toggleProductStatus(product: any) {
    this.productService.toggleProductStatus(product._id).subscribe(
      () => {
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
        () => {
          this.loadProducts();
        },
        (error: any) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  getProductImageUrl(product: any): string {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const imageUrl = product.imageUrls[0];
      return imageUrl.startsWith('http')
        ? imageUrl
        : `http://localhost:3000${imageUrl}`;
    }
    if (product.imageUrl) {
      return product.imageUrl.startsWith('http')
        ? product.imageUrl
        : `http://localhost:3000${product.imageUrl}`;
    }
    return 'assets/no-image.png';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/no-image.png';
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
