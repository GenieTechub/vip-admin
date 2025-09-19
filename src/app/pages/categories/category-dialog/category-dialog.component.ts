import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.categoryForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        isActive: this.data.isActive !== false
      });
      
      if (this.data.imageUrl) {
        this.imagePreview = this.data.imageUrl;
      }
    }
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
    if (this.categoryForm.valid) {
      this.loading = true;
      const formData = { ...this.categoryForm.value };

      // Handle image upload first if there's a new image
      if (this.selectedFile) {
        this.categoryService.uploadCategoryImage(this.selectedFile).subscribe({
          next: (uploadResponse: any) => {
            formData.imageUrl = uploadResponse.imageUrl;
            this.saveCategory(formData);
          },
          error: (error: any) => {
            console.error('Error uploading image:', error);
            this.snackBar.open('Error uploading image', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        // Keep existing image URL if in edit mode
        if (this.isEditMode && this.data.imageUrl) {
          formData.imageUrl = this.data.imageUrl;
        }
        this.saveCategory(formData);
      }
    }
  }

  private saveCategory(formData: any): void {
    const operation = this.isEditMode
      ? this.categoryService.updateCategory(this.data.id, formData)
      : this.categoryService.createCategory(formData);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open(
          `Category ${this.isEditMode ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || `Error ${this.isEditMode ? 'updating' : 'creating'} category`,
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
