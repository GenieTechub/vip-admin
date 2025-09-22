import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';;

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
// import { IconModule } from 'primeng/icon'; // For PrimeIcons usage


import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CardModule,
    ProgressSpinnerModule,
    RippleModule,
    FloatLabelModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = false;
  searchTerm = '';

  displayedColumns: string[] = ['avatar', 'name', 'email', 'phone', 'role', 'status', 'createdAt', 'actions'];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe(
      (response: any) => {
        this.users = response.users || [];
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    );
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(user =>
      !this.searchTerm ||
      user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleUserStatus(user: any) {
    this.userService.toggleUserStatus(user._id).subscribe(
      (response: any) => {
        this.loadUsers();
      },
      (error: any) => {
        console.error('Error toggling user status:', error);
      }
    );
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      this.userService.deleteUser(user._id).subscribe(
        (response: any) => {
          this.loadUsers();
        },
        (error: any) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  getDefaultAvatar(): string {
    return 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg';
  }

  onAvatarError(event: any): void {
    event.target.src = this.getDefaultAvatar();
  }
}
