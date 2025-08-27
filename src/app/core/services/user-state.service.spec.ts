import { TestBed } from '@angular/core/testing';
import { skip, take } from 'rxjs/operators';
import { User, UserFilters } from '../models/user.model';
import { UserStateService } from './user-state.service';

describe('UserStateService', () => {
  let service: UserStateService;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'inactive',
      phone: '',
      website: '',
      company: undefined,
      address: undefined
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active',
      phone: '',
      website: '',
      company: undefined,
      address: undefined
    }
  ];

  const mockUser: User = {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'active',
    phone: '',
    website: '',
    company: undefined,
    address: undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStateService]
    });
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty initial state', () => {
      expect(service.currentUsers).toEqual([]);
      expect(service.isLoading).toBe(false);
      expect(service.currentError).toBeNull();
      expect(service.currentFilters).toEqual({});
    });
  });

  describe('Users management', () => {
    it('should set users', () => {
      service.setUsers(mockUsers);
      expect(service.currentUsers).toEqual(mockUsers);
    });

    it('should add a user', () => {
      service.setUsers(mockUsers);
      service.addUser(mockUser);
      
      expect(service.currentUsers).toContain(mockUser);
      expect(service.currentUsers.length).toBe(3);
    });

    it('should update a user', () => {
      service.setUsers(mockUsers);
      const updatedUser = { ...mockUsers[0], name: 'Updated Name' };
      
      service.updateUser(updatedUser);
      
      expect(service.currentUsers[0].name).toBe('Updated Name');
    });

    it('should remove a user', () => {
      service.setUsers(mockUsers);
      service.removeUser(1);
      
      expect(service.currentUsers.length).toBe(1);
      expect(service.currentUsers[0].id).toBe(2);
    });
  });

  describe('Loading state', () => {
    it('should set loading state', () => {
      service.setLoading(true);
      expect(service.isLoading).toBe(true);
      
      service.setLoading(false);
      expect(service.isLoading).toBe(false);
    });
  });

  describe('Error state', () => {
    it('should set and clear error', () => {
      const errorMessage = 'Test error';
      
      service.setError(errorMessage);
      expect(service.currentError).toBe(errorMessage);
      
      service.clearError();
      expect(service.currentError).toBeNull();
    });
  });

  describe('Filters management', () => {
    it('should set filters', () => {
      const filters: UserFilters = { name: 'John', status: 'active' };
      service.setFilters(filters);
      
      expect(service.currentFilters).toEqual(filters);
    });

    it('should update specific filter', () => {
      service.setFilters({ name: 'John' });
      service.updateFilter('status', 'active');
      
      expect(service.currentFilters).toEqual({ name: 'John', status: 'active' });
    });

    it('should clear all filters', () => {
      service.setFilters({ name: 'John', status: 'active' });
      service.clearFilters();
      
      expect(service.currentFilters).toEqual({});
    });
  });

  describe('State reset', () => {
    it('should reset all state to initial values', () => {
      service.setUsers(mockUsers);
      service.setLoading(true);
      service.setError('Test error');
      service.setFilters({ name: 'John' });
      
      service.resetState();
      
      expect(service.currentUsers).toEqual([]);
      expect(service.isLoading).toBe(false);
      expect(service.currentError).toBeNull();
      expect(service.currentFilters).toEqual({});
    });
  });

  describe('Observables', () => {
    it('should emit users changes', (done) => {
      service.users$.pipe(skip(1), take(1)).subscribe(users => {
        expect(users).toEqual(mockUsers);
        done();
      });
      
      service.setUsers(mockUsers);
    });

    it('should emit loading changes', (done) => {
      service.loading$.pipe(skip(1), take(1)).subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
      
      service.setLoading(true);
    });

    it('should emit error changes', (done) => {
      const errorMessage = 'Test error';
      
      service.error$.pipe(skip(1), take(1)).subscribe(error => {
        expect(error).toBe(errorMessage);
        done();
      });
      
      service.setError(errorMessage);
    });

    it('should emit filter changes', (done) => {
      const filters: UserFilters = { name: 'John' };
      
      service.filters$.pipe(skip(1), take(1)).subscribe(filters => {
        expect(filters).toEqual(filters);
        done();
      });
      
      service.setFilters(filters);
    });
  });
});
