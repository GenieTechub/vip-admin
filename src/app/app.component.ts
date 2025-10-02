import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './services/auth.service';
import { CdkTableModule } from "@angular/cdk/table";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    CdkTableModule
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-Cart Admin';
  sidenavOpened = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/users', icon: 'people', label: 'Users' },
    { path: '/categories', icon: 'category', label: 'Categories' },
    { path: '/subcategories', icon: 'subdirectory_arrow_right', label: 'Subcategories' },
    { path: '/products', icon: 'inventory', label: 'Products' },
    { path: '/roles', icon: 'add_moderator', label: 'Roles' },
    { path: '/reviews', icon: 'rate_review', label: 'Reviews' },
    { path: '/orders', icon: 'shopping_cart', label: 'Orders' },
    { path: '/analytics', icon: 'analytics', label: 'Analytics' },
    { path: '/settings', icon: 'settings', label: 'Settings' }
  ];
  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout() {
    // Implement logout logic
    console.log('Logout clicked');
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  shouldShowLayout(): boolean {
    const currentUrl = this.router.url;
    const isLoginPage = currentUrl === '/login' || currentUrl.startsWith('/login');
    return this.isLoggedIn() && !isLoginPage;
  }
}
