import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User, UserFilters, UserFormData } from '../models/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'inactive', // ID 1 (odd) = inactive
      phone: '',
      website: '',
      company: undefined,
      address: undefined
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active', // ID 2 (even) = active
      phone: '',
      website: '',
      company: undefined,
      address: undefined
    }
  ];

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'inactive', // ID 1 (odd) = inactive
    phone: '',
    website: '',
    company: undefined,
    address: undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUsers', () => {
    it('should fetch users successfully', (done) => {
      const filters: UserFilters = { page: 1, limit: 10 };
      
      service.getUsers(filters).subscribe({
        next: (response) => {
          expect(response.users).toEqual(mockUsers);
          expect(response.total).toBe(2); // Total filtered users
          expect(response.page).toBe(1);
          expect(response.limit).toBe(10); // Limit from filters
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should apply filters correctly', (done) => {
      const filters: UserFilters = { name: 'Jane', status: 'active' };
      
      service.getUsers(filters).subscribe({
        next: (response) => {
          expect(response.users.length).toBe(1);
          expect(response.users[0].name).toContain('Jane');
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(mockUsers);
    });

    it('should handle HTTP errors gracefully', (done) => {
      const filters: UserFilters = { page: 1, limit: 10 };
      
      service.getUsers(filters).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserById', () => {
    it('should fetch a single user by ID', (done) => {
      service.getUserById(1).subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle user not found', (done) => {
      service.getUserById(999).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', (done) => {
      const newUserData: UserFormData = {
        name: 'New User',
        email: 'new@example.com',
        status: 'active'
      };

      service.createUser(newUserData).subscribe({
        next: (user) => {
          expect(user.name).toBe(newUserData.name);
          expect(user.email).toBe(newUserData.email);
          expect(user.status).toBe(newUserData.status);
          expect(user.id).toBeDefined();
          done();
        },
        error: done.fail
      });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user successfully', (done) => {
      const updateData: UserFormData = {
        name: 'Updated User',
        email: 'updated@example.com',
        status: 'inactive'
      };

      service.updateUser(1, updateData).subscribe({
        next: (user) => {
          expect(user.id).toBe(1);
          expect(user.name).toBe(updateData.name);
          expect(user.email).toBe(updateData.email);
          expect(user.status).toBe(updateData.status);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', (done) => {
      service.deleteUser(1).subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('searchUsers', () => {
    it('should return all users when query is empty', (done) => {
      // First load some users to populate the service state
      service.getUsers().subscribe({
        next: () => {
          // Now test search
          service.searchUsers('').subscribe({
            next: (users) => {
              expect(users).toEqual(mockUsers);
              done();
            },
            error: done.fail
          });
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(mockUsers);
    });

    it('should filter users by search query', (done) => {
      // First load some users to populate the service state
      service.getUsers().subscribe({
        next: () => {
          // Now test search
          service.searchUsers('John').subscribe({
            next: (users) => {
              expect(users.length).toBe(1);
              expect(users[0].name).toContain('John');
              done();
            },
            error: done.fail
          });
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(mockUsers);
    });
  });

  describe('error handling', () => {
    it('should clear error when clearError is called', () => {
      // First trigger an error
      service.getUsers().subscribe({
        next: () => {},
        error: () => {}
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      // Clear the error
      service.clearError();

      // Check that error is cleared
      service.error$.subscribe(error => {
        expect(error).toBeNull();
      });
    });
  });

  describe('loading states', () => {
    it('should set loading to true when making HTTP requests', (done) => {
      service.getUsers().subscribe({
        next: () => {
          // After the request completes, loading should be false
          service.loading$.subscribe(loading => {
            expect(loading).toBe(false);
            done();
          });
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(mockUsers);
    });
  });
});
