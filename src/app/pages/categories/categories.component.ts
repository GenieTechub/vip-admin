import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  loading = false;
  searchTerm = '';
  
  displayedColumns: string[] = ['name', 'description', 'status', 'createdAt', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  applyFilter() {
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Add debouncing for better performance
    this.searchTimeout = setTimeout(() => {
      this.loadCategories();
    }, 300);
  }

  loadCategories() {
    this.loading = true;
    
    // Build query parameters for backend filtering
    const params: any = {};
    
    if (this.searchTerm && this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }
    
    this.categoryService.getCategories(params).subscribe(
      (response: any) => {
        this.categories = response.categories || [];
        this.filteredCategories = [...this.categories]; // No need for frontend filtering anymore
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    );
  }

  deleteCategory(category: any) {
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category._id).subscribe(
        (response: any) => {
          this.loadCategories();
        },
        (error: any) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openEditDialog(category: any): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  private searchTimeout: any;
}
