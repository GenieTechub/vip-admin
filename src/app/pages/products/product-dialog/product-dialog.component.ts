import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  isEditMode = false;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]],
      isActive: [true],
      isFeatured: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    if (this.isEditMode && this.data) {
      this.productForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        price: this.data.price,
        stock: this.data.stock,
        categoryId: this.data.categoryId,
        isActive: this.data.isActive !== false,
        isFeatured: this.data.isFeatured || false
      });
      
      if (this.data.imageUrl) {
        this.imagePreview = this.data.imageUrl;
      }
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories || response;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const formData = { ...this.productForm.value };

      // Handle image upload first if there's a new image
      if (this.selectedFile) {
        console.log('Uploading new image...'); // Debug log
        this.productService.uploadProductImage(this.selectedFile).subscribe({
          next: (uploadResponse: any) => {
            console.log('Image upload response:', uploadResponse); // Debug log
            // Check different possible response structures
            formData.imageUrl = uploadResponse.files?.imageUrl || 
                               uploadResponse.imageUrl || 
                               uploadResponse.files?.imageUrls?.[0] || 
                               null;
            this.saveProduct(formData);
          },
          error: (error: any) => {
            console.error('Error uploading image:', error);
            this.snackBar.open('Error uploading image', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        // Keep existing image URL if in edit mode, otherwise don't include imageUrl field
        if (this.isEditMode && this.data?.imageUrl) {
          formData.imageUrl = this.data.imageUrl;
        }
        // For new products without image, don't set imageUrl at all (let backend handle default)
        console.log('No new image, form data:', formData); // Debug log
        this.saveProduct(formData);
      }
    } else {
      console.log('Form is invalid:', this.productForm.errors); // Debug log
    }
  }

  private saveProduct(formData: any): void {
    console.log('Saving product with data:', formData); // Debug log
    
    const operation = this.isEditMode
      ? this.productService.updateProduct(this.data.id, formData)
      : this.productService.createProduct(formData);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open(
          `Product ${this.isEditMode ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error saving product:', error);
        this.snackBar.open(
          error.error?.message || `Error ${this.isEditMode ? 'updating' : 'creating'} product`,
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
