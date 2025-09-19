import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllOrders(params: any = {}): Observable<any> {
    const queryParams = new URLSearchParams(params).toString();
    return this.http.get(`${this.baseUrl}/orders?${queryParams}`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/orders/${id}/status`, { status });
  }

  getOrderStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/stats`);
  }

  getRecentOrders(limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/recent?limit=${limit}`);
  }

  exportOrders(params: any = {}): Observable<any> {
    const queryParams = new URLSearchParams(params).toString();
    return this.http.get(`${this.baseUrl}/orders/export?${queryParams}`, { responseType: 'blob' });
  }
}