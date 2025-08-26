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
   * Get all users with optional filtering (pagination handled by Angular Material)
   */
  getUsers(filters: UserFilters = {}): Observable<UserListResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<any[]>(this.API_URL).pipe(
      delay(this.MOCK_DELAY), // Simulate network delay
      map(apiUsers => this.mapApiUsersToUsers(apiUsers)),
      map(users => this.applyFilters(users, filters)),
      map(filteredUsers => ({
        users: filteredUsers,
        total: filteredUsers.length,
        page: 1,
        limit: filteredUsers.length
      })),
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

    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      delay(this.MOCK_DELAY),
      map(apiUser => this.mapApiUsersToUsers([apiUser])[0]),
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
   * Map API users to our User interface
   */
  private mapApiUsersToUsers(apiUsers: any[]): User[] {
    return apiUsers.map(apiUser => ({
      id: apiUser.id,
      name: apiUser.name || apiUser.username || 'Unknown Name',
      email: apiUser.email || '',
      status: this.generateDeterministicStatus(apiUser.id),
      phone: apiUser.phone || '',
      website: apiUser.website || '',
      company: apiUser.company ? {
        name: apiUser.company.name || '',
        catchPhrase: apiUser.company.catchPhrase || '',
        bs: apiUser.company.bs || ''
      } : undefined,
      address: apiUser.address ? {
        street: apiUser.address.street || '',
        suite: apiUser.address.suite || '',
        city: apiUser.address.city || '',
        zipcode: apiUser.address.zipcode || '',
        geo: apiUser.address.geo ? {
          lat: apiUser.address.geo.lat || '',
          lng: apiUser.address.geo.lng || ''
        } : undefined
      } : undefined
    }));
  }

  /**
   * Generate deterministic status for demo purposes
   */
  private generateDeterministicStatus(userId: number): 'active' | 'inactive' {
    // Use userId to ensure same user always has same status
    return userId % 2 === 0 ? 'active' : 'inactive';
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
      total: users.length, // This is the total count of filtered users
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
