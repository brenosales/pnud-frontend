import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserFilters } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  // State subjects
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filtersSubject = new BehaviorSubject<UserFilters>({});

  // Public observables
  public users$ = this.usersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public filters$ = this.filtersSubject.asObservable();

  // Getters for current values
  get currentUsers(): User[] {
    return this.usersSubject.value;
  }

  get currentFilters(): UserFilters {
    return this.filtersSubject.value;
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  get currentError(): string | null {
    return this.errorSubject.value;
  }

  /**
   * Set users in state
   */
  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  /**
   * Add a single user to state
   */
  addUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, user]);
  }

  /**
   * Update a user in state
   */
  updateUser(updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    this.usersSubject.next(updatedUsers);
  }

  /**
   * Remove a user from state
   */
  removeUser(userId: number): void {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter(user => user.id !== userId);
    this.usersSubject.next(filteredUsers);
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Set error state
   */
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Set filters
   */
  setFilters(filters: UserFilters): void {
    this.filtersSubject.next(filters);
  }

  /**
   * Update specific filter
   */
  updateFilter<K extends keyof UserFilters>(key: K, value: UserFilters[K]): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({
      ...currentFilters,
      [key]: value
    });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filtersSubject.next({});
  }

  /**
   * Reset all state to initial values
   */
  resetState(): void {
    this.usersSubject.next([]);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
    this.filtersSubject.next({});
  }
}
