import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CardModule,
    ProgressSpinnerModule,
    RippleModule,
    FloatLabelModule,
    DialogModule,
    CheckboxModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  loading = false;
  searchTerm = '';

  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedCategory: any = null;

  categoryForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    const params: any = {};
    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    this.categoryService.getCategories(params).subscribe({
      next: (res: any) => {
        this.categories = res.categories || [];
        this.filteredCategories = [...this.categories];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  applyFilter() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.filteredCategories = this.categories.filter(c =>
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (c.description?.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }, 300);
  }

  openAddDialog() {
    this.selectedCategory = null;
    this.isEditMode = false;
    this.categoryForm.reset({ isActive: true });
    this.imagePreview = null;
    this.displayDialog = true;
  }

  openEditDialog(category: any) {
    this.selectedCategory = { ...category };
    this.isEditMode = true;
    this.categoryForm.patchValue(category);
    this.imagePreview = category.imageUrl || null;
    this.displayDialog = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onCancel() {
    this.displayDialog = false;
    this.categoryForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    const formData = { ...this.categoryForm.value };

    if (this.selectedFile) {
      // Upload the image first
      this.categoryService.uploadCategoryImage(this.selectedFile).subscribe({
        next: (res: any) => {
          formData.imageUrl = res.imageUrl;
          this.saveCategory(formData);
        },
        error: () => alert('Error uploading image')
      });
    } else {
      if (this.isEditMode && this.selectedCategory?.imageUrl) {
        formData.imageUrl = this.selectedCategory.imageUrl;
      }
      this.saveCategory(formData);
    }
  }

  private saveCategory(formData: any) {
    const operation = this.isEditMode
      ? this.categoryService.updateCategory(this.selectedCategory.id, formData)
      : this.categoryService.createCategory(formData);

    operation.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadCategories();
      },
      error: () => alert('Error saving category')
    });
  }

  deleteCategory(category: any) {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    this.categoryService.deleteCategory(category.id).subscribe(() => this.loadCategories());
  }

  private searchTimeout: any;
}
