import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { User, UserFilters, UserFormData, UserListResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';
  private readonly MOCK_DELAY = 500; // Simulate network delay
  
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  public users$ = this.usersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all users with optional filtering and pagination
   */
  getUsers(filters: UserFilters = {}): Observable<UserListResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<User[]>(this.API_URL).pipe(
      delay(this.MOCK_DELAY), // Simulate network delay
      map(users => this.applyFilters(users, filters)),
      map(filteredUsers => this.createPaginatedResponse(filteredUsers, filters)),
      tap(response => {
        this.usersSubject.next(response.users);
        this.loadingSubject.next(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: number): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<User>(`${this.API_URL}/${id}`).pipe(
      delay(this.MOCK_DELAY),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create a new user
   */
  createUser(userData: UserFormData): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const newUser: User = {
      id: this.generateId(),
      ...userData
    };

    // Simulate API call
    return of(newUser).pipe(
      delay(this.MOCK_DELAY),
      tap(user => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, user]);
        this.loadingSubject.next(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update an existing user
   */
  updateUser(id: number, userData: UserFormData): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const updatedUser: User = {
      id,
      ...userData
    };

    // Simulate API call
    return of(updatedUser).pipe(
      delay(this.MOCK_DELAY),
      tap(user => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.map(u => u.id === id ? user : u);
        this.usersSubject.next(updatedUsers);
        this.loadingSubject.next(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete a user
   */
  deleteUser(id: number): Observable<boolean> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Simulate API call
    return of(true).pipe(
      delay(this.MOCK_DELAY),
      tap(() => {
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter(u => u.id !== id);
        this.usersSubject.next(filteredUsers);
        this.loadingSubject.next(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Search users by name
   */
  searchUsers(query: string): Observable<User[]> {
    if (!query.trim()) {
      return this.users$;
    }

    return this.users$.pipe(
      map(users => 
        users.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Apply filters to users
   */
  private applyFilters(users: User[], filters: UserFilters): User[] {
    let filteredUsers = [...users];

    // Filter by name
    if (filters.name) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    // Sort users
    if (filters.sortBy) {
      filteredUsers.sort((a, b) => {
        const aValue = a[filters.sortBy! as keyof User];
        const bValue = b[filters.sortBy! as keyof User];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return filters.sortOrder === 'desc' ? -comparison : comparison;
        }
        
        return 0;
      });
    }

    return filteredUsers;
  }

  /**
   * Create paginated response
   */
  private createPaginatedResponse(users: User[], filters: UserFilters): UserListResponse {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total: users.length,
      page,
      limit
    };
  }

  /**
   * Generate a unique ID for new users
   */
  private generateId(): number {
    const currentUsers = this.usersSubject.value;
    const maxId = currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id)) : 0;
    return maxId + 1;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    this.errorSubject.next(errorMessage);
    this.loadingSubject.next(false);
    
    return throwError(() => new Error(errorMessage));
  }
}
