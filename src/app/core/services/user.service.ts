import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, UserFilters, UserFormData, UserListResponse } from '../models/user.model';
import { ConfigurationService } from './configuration.service';
import { UserApiService } from './user-api.service';
import { UserBusinessService } from './user-business.service';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly mockDelay: number;

  constructor(
    private apiService: UserApiService,
    private stateService: UserStateService,
    private businessService: UserBusinessService,
    private configService: ConfigurationService
  ) {
    this.mockDelay = this.configService.getMockDelay();
  }

  /**
   * Get all users with optional filtering
   */
  getUsers(filters: UserFilters = {}): Observable<UserListResponse> {
    this.stateService.setLoading(true);
    this.stateService.clearError();
    this.stateService.setFilters(filters);

    return this.apiService.fetchUsers().pipe(
      delay(this.mockDelay),
      map(apiUsers => {
        const users = this.businessService.mapApiUsersToUsers(apiUsers);
        const filteredUsers = this.businessService.applyFilters(users, filters);
        return this.businessService.createPaginatedResponse(filteredUsers, filters);
      }),
      tap(response => {
        this.stateService.setUsers(response.users);
        this.stateService.setLoading(false);
      })
    );
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: number): Observable<User> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.apiService.fetchUserById(id).pipe(
      delay(this.mockDelay),
      map(apiUser => {
        const users = this.businessService.mapApiUsersToUsers([apiUser]);
        return users[0];
      }),
      tap(() => {
        this.stateService.setLoading(false);
      })
    );
  }

  /**
   * Create a new user
   */
  createUser(userData: UserFormData): Observable<User> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.apiService.createUser(userData).pipe(
      delay(this.mockDelay),
      tap(user => {
        this.stateService.addUser(user);
        this.stateService.setLoading(false);
      })
    );
  }

  /**
   * Update an existing user
   */
  updateUser(id: number, userData: UserFormData): Observable<User> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.apiService.updateUser(id, userData).pipe(
      delay(this.mockDelay),
      tap(user => {
        this.stateService.updateUser(user);
        this.stateService.setLoading(false);
      })
    );
  }

  /**
   * Delete a user
   */
  deleteUser(id: number): Observable<boolean> {
    this.stateService.setLoading(true);
    this.stateService.clearError();

    return this.apiService.deleteUser(id).pipe(
      delay(this.mockDelay),
      tap(() => {
        this.stateService.removeUser(id);
        this.stateService.setLoading(false);
      })
    );
  }

  /**
   * Search users by name or email
   */
  searchUsers(query: string): Observable<User[]> {
    const currentUsers = this.stateService.currentUsers;
    const searchResults = this.businessService.searchUsers(currentUsers, query);
    
    return new Observable(observer => {
      observer.next(searchResults);
      observer.complete();
    });
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.stateService.clearError();
  }

  /**
   * Get current state observables
   */
  get users$() {
    return this.stateService.users$;
  }

  get loading$() {
    return this.stateService.loading$;
  }

  get error$() {
    return this.stateService.error$;
  }

  get filters$() {
    return this.stateService.filters$;
  }

  /**
   * Get current state values
   */
  get currentUsers() {
    return this.stateService.currentUsers;
  }

  get currentFilters() {
    return this.stateService.currentFilters;
  }

  get isLoading() {
    return this.stateService.isLoading;
  }

  get currentError() {
    return this.stateService.currentError;
  }
} 
