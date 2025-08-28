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

  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      catchError(error => this.handleHttpError(error))
    );
  }

  fetchUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      catchError(error => this.handleHttpError(error))
    );
  }

  createUser(userData: UserFormData): Observable<User> {
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
   * Simulated PUT request
   */
  updateUser(id: number, userData: UserFormData): Observable<User> {
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
   * Simulated DELETE request
   */
  deleteUser(id: number): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Error: ${error.error.message}`;
    } else {
     
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  private generateTemporaryId(): number {
    return Date.now(); 
  }
}
