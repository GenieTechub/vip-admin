import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = false;
  searchTerm = '';
  selectedRating = '';
  
  displayedColumns: string[] = ['product', 'user', 'rating', 'comment', 'date', 'actions'];
  
  private searchTimeout: any;

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    
    const params: any = {};
    
    if (this.searchTerm && this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }
    
    if (this.selectedRating) {
      params.rating = this.selectedRating;
    }
    
    this.reviewService.getAllReviews(params).subscribe({
      next: (response: any) => {
        this.reviews = response.reviews || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
        this.snackBar.open('Error loading reviews', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.loadReviews();
    }, 300);
  }

  deleteReview(review: any): void {
    if (confirm(`Are you sure you want to delete this review by ${review.user?.name || 'Anonymous'}?`)) {
      this.reviewService.deleteReview(review.id).subscribe({
        next: (response: any) => {
          this.snackBar.open('Review deleted successfully', 'Close', { duration: 3000 });
          this.loadReviews();
        },
        error: (error: any) => {
          console.error('Error deleting review:', error);
          this.snackBar.open('Error deleting review', 'Close', { duration: 3000 });
        }
      });
    }
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products'], { queryParams: { productId } });
  }

  getProductImageUrl(product: any): string {
    if (!product?.imageUrl) return 'assets/images/no-image.png';
    return product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:3000${product.imageUrl}`;
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
