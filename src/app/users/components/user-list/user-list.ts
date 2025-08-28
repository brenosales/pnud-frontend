import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { User, UserFilters } from '../../../core/models/user.model';
import { ConfigurationService } from '../../../core/services/configuration.service';
import { UserService } from '../../../core/services/user.service';
import { StatusPipe } from '../../../shared/pipes/status.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    StatusPipe
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table data
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  
  // Pagination
  totalItems = 100; // Default value to prevent "0 of 0" display
  pageSize: number;
  pageSizeOptions: readonly number[];
  
  // Loading and error states
  loading = false;
  error: string | null = null;
  
  // Search and filters
  searchControl = new FormControl('');
  statusFilterControl = new FormControl<string>('');
  
  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private configService: ConfigurationService
  ) {
    this.pageSize = this.configService.getDefaultPageSize();
    this.pageSizeOptions = this.configService.getPageSizeOptions();
  }

  ngOnInit(): void {
    this.setupSearch();
    this.setupFilters();
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    // Connect paginator and sort to data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Set initial page size
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
    
    // Custom sorting for status column
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'status':
          return item.status === 'active' ? 1 : 0;
        default:
          const value = item[property as keyof User];
          return typeof value === 'string' || typeof value === 'number' ? value : '';
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.configService.getSearchDebounceTime()),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadUsers();
      });
  }

  private setupFilters(): void {
    this.statusFilterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    const filters: UserFilters = {
      name: this.searchControl.value || undefined,
      status: (this.statusFilterControl.value as 'active' | 'inactive' | undefined) || undefined,
      sortBy: this.sort?.active as any || 'name',
      sortOrder: this.sort?.direction || 'asc'
    };

    this.userService.getUsers(filters).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.users;
        this.totalItems = response.users.length;
        
        if (this.paginator && this.dataSource.paginator !== this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        
        console.log('Data loaded:', response.users.length, 'users');
        console.log('Paginator connected:', !!this.dataSource.paginator);
        console.log('Current page:', this.paginator?.pageIndex);
        console.log('Page size:', this.paginator?.pageSize);
        
        this.loading = false;
        this.error = null;
      },
      error: (error: any) => {
        this.error = error.message;
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  viewUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  editUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza de que deseja excluir ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error: any) => {
          this.error = error.message;
        }
      });
    }
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  onPageChange(): void {
    if (this.paginator && this.dataSource.paginator !== this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onPageSizeChange(): void {
    if (this.paginator) {
      this.pageSize = this.paginator.pageSize;
      this.paginator.pageIndex = 0;
    }
  }

  onSortChange(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilterControl.setValue('');
    this.loadUsers();
  }
}
