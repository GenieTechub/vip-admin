import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllReviews(params: any = {}): Observable<any> {
    let queryString = '';
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.productId) queryParams.append('productId', params.productId);
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}/reviews?${queryString}` : `${this.baseUrl}/reviews`;
    
    return this.http.get(url, { headers: this.getHeaders() });
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reviews/${reviewId}`, { headers: this.getHeaders() });
  }

  getProductReviews(productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${productId}/reviews`, { headers: this.getHeaders() });
  }
}
