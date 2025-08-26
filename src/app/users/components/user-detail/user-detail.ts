import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { StatusPipe } from '../../../shared/pipes/status.pipe';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    StatusPipe,
    NamePipe
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading = false;
  error: string | null = null;
  userId: number | null = null;

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserFromRoute();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user ID from route and fetch user data
   */
  private loadUserFromRoute(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id || isNaN(+id)) {
      this.error = 'Invalid user ID';
      return;
    }

    this.userId = +id;
    this.loadUser();
  }

  /**
   * Load user data from service
   */
  private loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.error = null;

    this.userService.getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.user = user;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.message || 'Failed to load user';
          this.loading = false;
        }
      });
  }

  /**
   * Navigate back to user list
   */
  goBack(): void {
    this.router.navigate(['/users']);
  }

  /**
   * Navigate to edit user
   */
  editUser(): void {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }

  /**
   * Delete current user with confirmation
   */
  deleteUser(): void {
    if (!this.user) return;

    const confirmMessage = `Are you sure you want to delete ${this.user.name}? This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      this.loading = true;
      
      this.userService.deleteUser(this.user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/users'], { 
              queryParams: { message: `User "${this.user!.name}" was deleted successfully` }
            });
          },
          error: (error: any) => {
            this.error = error.message || 'Failed to delete user';
            this.loading = false;
          }
        });
    }
  }

  /**
   * Retry loading user data
   */
  retryLoad(): void {
    this.loadUser();
  }

  /**
   * Get user's initials for avatar
   */
  getUserInitials(): string {
    if (!this.user?.name) return '??';
    
    const names = this.user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.user.name.substring(0, 2).toUpperCase();
  }

  /**
   * Format address for display
   */
  getFormattedAddress(): string {
    if (!this.user?.address) return 'No address provided';
    
    const { street, suite, city, zipcode } = this.user.address;
    return `${street} ${suite}, ${city} ${zipcode}`;
  }

  /**
   * Check if user has contact information
   */
  hasContactInfo(): boolean {
    return !!(this.user?.phone || this.user?.email || this.user?.website);
  }

  /**
   * Check if user has company information
   */
  hasCompanyInfo(): boolean {
    return !!(this.user?.company?.name);
  }
}
