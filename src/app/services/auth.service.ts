import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/admin/login`, credentials);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
}