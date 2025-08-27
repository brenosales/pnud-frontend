import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserFormData } from '../models/user.model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly API_URL: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
    this.API_URL = this.configService.getFullApiUrl('users');
  }

  /**
   * Fetch all users from the API
   */
  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      catchError(error => this.handleHttpError(error))
    );
  }

  /**
   * Fetch a single user by ID
   */
  fetchUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      catchError(error => this.handleHttpError(error))
    );
  }

  /**
   * Create a new user (simulated)
   */
  createUser(userData: UserFormData): Observable<User> {
    // Simulate API call - in real app this would be POST request
    const newUser: User = {
      id: this.generateTemporaryId(),
      ...userData,
      phone: '',
      website: '',
      company: undefined,
      address: undefined
    };
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(newUser);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Update an existing user (simulated)
   */
  updateUser(id: number, userData: UserFormData): Observable<User> {
    // Simulate API call - in real app this would be PUT request
    const updatedUser: User = {
      id,
      ...userData,
      phone: '',
      website: '',
      company: undefined,
      address: undefined
    };
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(updatedUser);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Delete a user (simulated)
   */
  deleteUser(id: number): Observable<boolean> {
    // Simulate API call - in real app this would be DELETE request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Generate a temporary ID for new users
   */
  private generateTemporaryId(): number {
    return Date.now(); // Simple temporary ID generation
  }
}
