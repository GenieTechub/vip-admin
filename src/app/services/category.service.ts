import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCategories(params: any = {}): Observable<any> {
    let queryString = '';
    const queryParams = new URLSearchParams();
    
    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    
    if (params.status) {
      queryParams.append('status', params.status);
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}/categories?${queryString}` : `${this.baseUrl}/categories`;
    
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/${id}`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, categoryData);
  }

  updateCategory(id: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  uploadCategoryImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.baseUrl}/uploads`, formData, { headers });
  }
}
