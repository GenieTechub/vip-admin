import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    TooltipModule,
    ToastModule,
    SelectModule,
    FloatLabelModule,
    MatIconModule
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  providers: [MessageService]
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = false;
  searchTerm = '';
  selectedRating: string | null = null;

  ratingOptions = [
    { label: 'All Ratings', value: null },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' }
  ];

  private searchTimeout: any;

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;

    const params: any = {};
    if (this.searchTerm?.trim()) params.search = this.searchTerm.trim();
    if (this.selectedRating) params.rating = this.selectedRating;

    this.reviewService.getAllReviews(params).subscribe({
      next: (res: any) => {
        this.reviews = res.reviews || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reviews' });
      }
    });
  }

  applyFilter(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadReviews(), 300);
  }

  deleteReview(review: any): void {
    if (confirm(`Are you sure you want to delete this review by ${review.user?.name || 'Anonymous'}?`)) {
      this.reviewService.deleteReview(review.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Review deleted successfully' });
          this.loadReviews();
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete review' });
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
