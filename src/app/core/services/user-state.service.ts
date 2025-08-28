import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserFilters } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filtersSubject = new BehaviorSubject<UserFilters>({});

  
  public users$ = this.usersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public filters$ = this.filtersSubject.asObservable();

  
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

  
  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  
  addUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, user]);
  }

  
  updateUser(updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    this.usersSubject.next(updatedUsers);
  }

  
  removeUser(userId: number): void {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter(user => user.id !== userId);
    this.usersSubject.next(filteredUsers);
  }

  
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  
  clearError(): void {
    this.errorSubject.next(null);
  }

  
  setFilters(filters: UserFilters): void {
    this.filtersSubject.next(filters);
  }


  updateFilter<K extends keyof UserFilters>(key: K, value: UserFilters[K]): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({
      ...currentFilters,
      [key]: value
    });
  }

  
  clearFilters(): void {
    this.filtersSubject.next({});
  }

  
  resetState(): void {
    this.usersSubject.next([]);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
    this.filtersSubject.next({});
  }
}
