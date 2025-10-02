import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { SubcategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-subcategories',
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
    CheckboxModule,
    SelectModule,
    TagModule
  ],
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss']
})
export class SubcategoriesComponent implements OnInit {
  subcategories: any[] = [];
  filteredSubcategories: any[] = [];
  categories: any[] = [];
  loading = false;
  searchTerm = '';
  selectedCategoryId = '';
  selectedStatus = '';

  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedSubcategory: any = null;

  subcategoryForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' }
  ];

  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.subcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadSubcategories();
  }

  loadCategories() {
    this.categoryService.getCategories({}).subscribe({
      next: (res: any) => {
        this.categories = res.categories || [];
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadSubcategories() {
    this.loading = true;
    const params: any = {};
    
    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }
    
    if (this.selectedCategoryId) {
      params.categoryId = this.selectedCategoryId;
    }
    
    if (this.selectedStatus !== '') {
      params.isActive = this.selectedStatus === 'true';
    }

    this.subcategoryService.getSubcategories(params).subscribe({
      next: (res: any) => {
        this.subcategories = res.subcategories || [];
        this.filteredSubcategories = [...this.subcategories];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  applyFilter() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadSubcategories();
    }, 300);
  }

  onCategoryChange() {
    this.loadSubcategories();
  }

  onStatusChange() {
    this.loadSubcategories();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  openAddDialog() {
    this.selectedSubcategory = null;
    this.isEditMode = false;
    this.subcategoryForm.reset({ isActive: true });
    this.imagePreview = null;
    this.displayDialog = true;
  }

  openEditDialog(subcategory: any) {
    this.selectedSubcategory = { ...subcategory };
    this.isEditMode = true;
    this.subcategoryForm.patchValue(subcategory);
    this.imagePreview = subcategory.imageUrl || null;
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
    this.subcategoryForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.subcategoryForm.invalid) return;

    const formData = { ...this.subcategoryForm.value };

    if (this.selectedFile) {
      // Upload the image first
      this.subcategoryService.uploadSubcategoryImage(this.selectedFile).subscribe({
        next: (res: any) => {
          formData.imageUrl = res.imageUrl;
          this.saveSubcategory(formData);
        },
        error: () => alert('Error uploading image')
      });
    } else {
      if (this.isEditMode && this.selectedSubcategory?.imageUrl) {
        formData.imageUrl = this.selectedSubcategory.imageUrl;
      }
      this.saveSubcategory(formData);
    }
  }

  private saveSubcategory(formData: any) {
    const operation = this.isEditMode
      ? this.subcategoryService.updateSubcategory(this.selectedSubcategory.id, formData)
      : this.subcategoryService.createSubcategory(formData);

    operation.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadSubcategories();
      },
      error: () => alert('Error saving subcategory')
    });
  }

  deleteSubcategory(subcategory: any) {
    if (!confirm(`Delete subcategory "${subcategory.name}"?`)) return;
    this.subcategoryService.deleteSubcategory(subcategory.id).subscribe(() => this.loadSubcategories());
  }

  viewProducts(subcategory: any) {
    // Navigate to products page with subcategory filter
    this.router.navigate(['/products'], { 
      queryParams: { 
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name 
      } 
    });
  }

  private searchTimeout: any;
}
