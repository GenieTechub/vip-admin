import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/dashboard`);
  }

  getOrderAnalytics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/orders`);
  }

  getUserAnalytics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/users`);
  }

  getProductAnalytics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/products`);
  }
}
