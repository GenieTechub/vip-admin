import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get admin products only (for admin panel)
  getAdminProducts(params: any = {}): Observable<any> {
    const queryParams = new URLSearchParams(params).toString();
    return this.http.get(`${this.baseUrl}/products/admin-products?${queryParams}`);
  }

  // Get all products (including user products) - for reference only
  getAllProducts(params: any = {}): Observable<any> {
    const queryParams = new URLSearchParams(params).toString();
    return this.http.get(`${this.baseUrl}/products?${queryParams}`);
  }

  // Remove the old getProducts method and replace with getAdminProducts
  getProducts(): Observable<any> {
    return this.getAdminProducts();
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`);
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, productData);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }

  toggleProductStatus(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/products/${id}/toggle-status`, {});
  }

  uploadProductImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.baseUrl}/uploads`, formData, { headers });
  }
}
