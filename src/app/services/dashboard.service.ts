import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/dashboard/stats`);
  }

  getChartData(): Observable<any> {
    // This would typically come from your backend
    return new Observable(observer => {
      observer.next({
        salesData: [
          { month: 'Jan', sales: 12000 },
          { month: 'Feb', sales: 19000 },
          { month: 'Mar', sales: 15000 },
          { month: 'Apr', sales: 25000 },
          { month: 'May', sales: 22000 },
          { month: 'Jun', sales: 30000 }
        ],
        categoryData: [
          { name: 'Electronics', value: 40 },
          { name: 'Clothing', value: 30 },
          { name: 'Books', value: 20 },
          { name: 'Others', value: 10 }
        ]
      });
    });
  }
}