import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserFormData } from '../models/user.model';
import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  const mockApiUsers = [
    {
      id: 1,
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      website: 'johndoe.com',
      company: {
        name: 'John Corp',
        catchPhrase: 'Making things better',
        bs: 'innovative solutions'
      },
      address: {
        street: '123 Main St',
        suite: 'Apt 1',
        city: 'New York',
        zipcode: '10001',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      website: 'janesmith.com'
    }
  ];

  const mockUserData: UserFormData = {
    name: 'New User',
    email: 'new@example.com',
    status: 'active'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApiService]
    });
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchUsers', () => {
    it('should fetch all users successfully', (done) => {
      service.fetchUsers().subscribe({
        next: (users) => {
          expect(users).toEqual(mockApiUsers);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockApiUsers);
    });

    it('should handle HTTP errors gracefully', (done) => {
      service.fetchUsers().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors', (done) => {
      service.fetchUsers().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error:');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('fetchUserById', () => {
    it('should fetch a single user by ID successfully', (done) => {
      const userId = 1;
      
      service.fetchUserById(userId).subscribe({
        next: (user) => {
          expect(user).toEqual(mockApiUsers[0]);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiUsers[0]);
    });

    it('should handle user not found', (done) => {
      const userId = 999;
      
      service.fetchUserById(userId).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
          done();
        }
      });

      const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users/${userId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid user ID', (done) => {
      const userId = -1;
      
      service.fetchUserById(userId).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 400');
          done();
        }
      });

      const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users/${userId}`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', (done) => {
      service.createUser(mockUserData).subscribe({
        next: (user) => {
          expect(user.name).toBe(mockUserData.name);
          expect(user.email).toBe(mockUserData.email);
          expect(user.status).toBe(mockUserData.status);
          expect(user.id).toBeDefined();
          expect(user.phone).toBe('');
          expect(user.website).toBe('');
          expect(user.company).toBeUndefined();
          expect(user.address).toBeUndefined();
          done();
        },
        error: done.fail
      });
    });

    it('should generate unique ID for new user', (done) => {
      service.createUser(mockUserData).subscribe({
        next: (user) => {
          expect(user.id).toBeGreaterThan(0);
          expect(typeof user.id).toBe('number');
          done();
        },
        error: done.fail
      });
    });

    it('should handle user creation with minimal data', (done) => {
      const minimalUserData: UserFormData = {
        name: 'Minimal User',
        email: 'minimal@example.com',
        status: 'inactive'
      };

      service.createUser(minimalUserData).subscribe({
        next: (user) => {
          expect(user.name).toBe(minimalUserData.name);
          expect(user.email).toBe(minimalUserData.email);
          expect(user.status).toBe(minimalUserData.status);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user successfully', (done) => {
      const userId = 1;
      const updatedUserData: UserFormData = {
        name: 'Updated User',
        email: 'updated@example.com',
        status: 'inactive'
      };

      service.updateUser(userId, updatedUserData).subscribe({
        next: (user) => {
          expect(user.id).toBe(userId);
          expect(user.name).toBe(updatedUserData.name);
          expect(user.email).toBe(updatedUserData.email);
          expect(user.status).toBe(updatedUserData.status);
          done();
        },
        error: done.fail
      });
    });

    it('should preserve user ID during update', (done) => {
      const userId = 999;
      
      service.updateUser(userId, mockUserData).subscribe({
        next: (user) => {
          expect(user.id).toBe(userId);
          done();
        },
        error: done.fail
      });
    });

    it('should handle update with same data', (done) => {
      const userId = 1;
      
      service.updateUser(userId, mockUserData).subscribe({
        next: (user) => {
          expect(user.id).toBe(userId);
          expect(user.name).toBe(mockUserData.name);
          expect(user.email).toBe(mockUserData.email);
          expect(user.status).toBe(mockUserData.status);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', (done) => {
      const userId = 1;
      
      service.deleteUser(userId).subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done.fail
      });
    });

    it('should handle deletion of non-existent user', (done) => {
      const userId = 999;
      
      service.deleteUser(userId).subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done.fail
      });
    });

    it('should handle deletion with invalid ID', (done) => {
      const userId = -1;
      
      service.deleteUser(userId).subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('API URL configuration', () => {
    it('should use correct API base URL', () => {
      const expectedUrl = 'https://jsonplaceholder.typicode.com/users';
      
      service.fetchUsers().subscribe();
      
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush([]);
    });

    it('should construct correct URL for individual user', () => {
      const userId = 123;
      const expectedUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
      
      service.fetchUserById(userId).subscribe();
      
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush({});
    });
  });

  describe('Error handling', () => {
    it('should handle client-side errors', (done) => {
      service.fetchUsers().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error:');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.error(new ErrorEvent('Client error'));
    });

    it('should handle server-side errors with status code', (done) => {
      service.fetchUsers().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 503');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle server-side errors without status code', (done) => {
      service.fetchUsers().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 0');
          done();
        }
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush('Unknown Error', { status: 0, statusText: 'Unknown Error' });
    });
  });
});
