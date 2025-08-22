import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { UserFormData } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  submitting = false;
  
  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form with validation
   */
  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      status: ['active', Validators.required]
    });
  }

  /**
   * Check if we're in edit mode and load user data
   */
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUserData();
    }
  }

  /**
   * Load user data for editing
   */
  private loadUserData(): void {
    if (!this.userId) return;

    this.loading = true;
    this.userService.getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            status: user.status
          });
          this.loading = false;
        },
        error: (error: any) => {
          this.snackBar.open(
            `Error loading user: ${error.message}`, 
            'Close', 
            { duration: 5000 }
          );
          this.loading = false;
          this.router.navigate(['/users']);
        }
      });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formData: UserFormData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.updateUser(formData);
    } else {
      this.createUser(formData);
    }
  }

  /**
   * Create a new user
   */
  private createUser(formData: UserFormData): void {
    this.userService.createUser(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.snackBar.open(
            `User "${user.name}" created successfully!`, 
            'Close', 
            { duration: 3000 }
          );
          this.router.navigate(['/users']);
        },
        error: (error: any) => {
          this.snackBar.open(
            `Error creating user: ${error.message}`, 
            'Close', 
            { duration: 5000 }
          );
          this.submitting = false;
        }
      });
  }

  /**
   * Update existing user
   */
  private updateUser(formData: UserFormData): void {
    if (!this.userId) return;

    this.userService.updateUser(this.userId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.snackBar.open(
            `User "${user.name}" updated successfully!`, 
            'Close', 
            { duration: 3000 }
          );
          this.router.navigate(['/users']);
        },
        error: (error: any) => {
          this.snackBar.open(
            `Error updating user: ${error.message}`, 
            'Close', 
            { duration: 5000 }
          );
          this.submitting = false;
        }
      });
  }

  /**
   * Cancel form and go back to user list
   */
  onCancel(): void {
    this.router.navigate(['/users']);
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    
    if (control.errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.errors['maxlength']) {
      return `${this.getFieldDisplayName(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    
    if (control.errors['pattern']) {
      return `${this.getFieldDisplayName(fieldName)} contains invalid characters`;
    }

    return 'Invalid input';
  }

  /**
   * Get display name for form fields
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      status: 'Status'
    };
    
    return fieldNames[fieldName] || fieldName;
  }

  /**
   * Check if a field has errors and has been touched
   */
  hasError(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
