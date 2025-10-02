import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSubcategories(params: any = {}): Observable<any> {
    let queryString = '';
    const queryParams = new URLSearchParams();
    
    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    
    if (params.categoryId && params.categoryId.trim()) {
      queryParams.append('categoryId', params.categoryId.trim());
    }
    
    if (params.isActive !== undefined && params.isActive !== null) {
      queryParams.append('isActive', params.isActive.toString());
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}/subcategories?${queryString}` : `${this.baseUrl}/subcategories`;
    
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getSubcategoriesByCategory(categoryId: string, params: any = {}): Observable<any> {
    let queryString = '';
    const queryParams = new URLSearchParams();
    
    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    
    if (params.isActive !== undefined && params.isActive !== null) {
      queryParams.append('isActive', params.isActive.toString());
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    queryString = queryParams.toString();
    const url = queryString 
      ? `${this.baseUrl}/subcategories/category/${categoryId}?${queryString}` 
      : `${this.baseUrl}/subcategories/category/${categoryId}`;
    
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getSubcategoryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subcategories/${id}`, { headers: this.getHeaders() });
  }

  getSubcategoryProducts(subcategoryId: string, params: any = {}): Observable<any> {
    let queryString = '';
    const queryParams = new URLSearchParams();
    
    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    
    if (params.minPrice) {
      queryParams.append('minPrice', params.minPrice.toString());
    }
    
    if (params.maxPrice) {
      queryParams.append('maxPrice', params.maxPrice.toString());
    }
    
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    queryString = queryParams.toString();
    const url = queryString 
      ? `${this.baseUrl}/subcategories/${subcategoryId}/products?${queryString}` 
      : `${this.baseUrl}/subcategories/${subcategoryId}/products`;
    
    return this.http.get(url, { headers: this.getHeaders() });
  }

  createSubcategory(subcategoryData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/subcategories`, subcategoryData, { headers: this.getHeaders() });
  }

  updateSubcategory(id: string, subcategoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/subcategories/${id}`, subcategoryData, { headers: this.getHeaders() });
  }

  deleteSubcategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/subcategories/${id}`, { headers: this.getHeaders() });
  }

  uploadSubcategoryImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.baseUrl}/uploads`, formData, { headers });
  }
}


