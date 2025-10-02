import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidenavOpened = true;
  currentUser = { name: 'Admin User' };

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/users', icon: 'people', label: 'Users' },
    { path: '/categories', icon: 'category', label: 'Categories' },
    { path: '/subcategories', icon: 'subdirectory_arrow_right', label: 'Subcategories' },
    { path: '/products', icon: 'inventory', label: 'Products' },
    { path: '/reviews', icon: 'rate_review', label: 'Reviews' },
    { path: '/orders', icon: 'shopping_cart', label: 'Orders' },
    { path: '/analytics', icon: 'analytics', label: 'Analytics' },
    { path: '/settings', icon: 'settings', label: 'Settings' }
  ];

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout() {
    console.log('Logout clicked');
  }
}