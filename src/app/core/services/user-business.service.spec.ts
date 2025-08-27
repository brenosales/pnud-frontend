import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';
import { UserBusinessService } from './user-business.service';

describe('UserBusinessService', () => {
  let service: UserBusinessService;

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

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'johndoe',
      email: 'john@example.com',
      status: 'inactive',
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
      status: 'active',
      phone: '098-765-4321',
      website: 'janesmith.com',
      company: undefined,
      address: undefined
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserBusinessService]
    });
    service = TestBed.inject(UserBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapApiUsersToUsers', () => {
    it('should map API users to User interface', () => {
      const result = service.mapApiUsersToUsers(mockApiUsers);
      
      expect(result).toHaveSize(2);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('johndoe'); // Uses username when name is not available
      expect(result[0].status).toBe('inactive'); // ID 1 (odd) = inactive
      expect(result[0].phone).toBe('123-456-7890');
      expect(result[0].website).toBe('johndoe.com');
      expect(result[0].company).toBeDefined();
      expect(result[0].address).toBeDefined();
      
      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe('Jane Smith'); // Uses name when available
      expect(result[1].status).toBe('active'); // ID 2 (even) = active
      expect(result[1].company).toBeUndefined();
      expect(result[1].address).toBeUndefined();
    });

    it('should handle missing optional fields', () => {
      const minimalApiUser = {
        id: 3,
        email: 'minimal@example.com'
      };
      
      const result = service.mapApiUsersToUsers([minimalApiUser]);
      
      expect(result[0].name).toBe('Unknown Name');
      expect(result[0].phone).toBe('');
      expect(result[0].website).toBe('');
      expect(result[0].company).toBeUndefined();
      expect(result[0].address).toBeUndefined();
    });
  });

  describe('generateStatus', () => {
    it('should generate active status for even IDs', () => {
      expect(service['generateStatus'](2)).toBe('active');
      expect(service['generateStatus'](4)).toBe('active');
      expect(service['generateStatus'](100)).toBe('active');
    });

    it('should generate inactive status for odd IDs', () => {
      expect(service['generateStatus'](1)).toBe('inactive');
      expect(service['generateStatus'](3)).toBe('inactive');
      expect(service['generateStatus'](99)).toBe('inactive');
    });
  });

  describe('applyFilters', () => {
    it('should return all users when no filters applied', () => {
      const result = service.applyFilters(mockUsers, {});
      expect(result).toEqual(mockUsers);
    });

    it('should filter by name', () => {
      const result = service.applyFilters(mockUsers, { name: 'jane' });
      expect(result).toHaveSize(1);
      expect(result[0].name).toContain('Jane');
    });

    it('should filter by status', () => {
      const result = service.applyFilters(mockUsers, { status: 'active' });
      expect(result).toHaveSize(1);
      expect(result[0].status).toBe('active');
    });

    it('should filter by both name and status', () => {
      const result = service.applyFilters(mockUsers, { 
        name: 'jane', 
        status: 'active' 
      });
      expect(result).toHaveSize(1);
      expect(result[0].name).toContain('Jane');
      expect(result[0].status).toBe('active');
    });

    it('should sort by name ascending', () => {
      const result = service.applyFilters(mockUsers, { 
        sortBy: 'name', 
        sortOrder: 'asc' 
      });
      expect(result[0].name).toBe('Jane Smith');
      expect(result[1].name).toBe('johndoe');
    });

    it('should sort by name descending', () => {
      const result = service.applyFilters(mockUsers, { 
        sortBy: 'name', 
        sortOrder: 'desc' 
      });
      expect(result[0].name).toBe('johndoe');
      expect(result[1].name).toBe('Jane Smith');
    });

    it('should sort by email', () => {
      const result = service.applyFilters(mockUsers, { 
        sortBy: 'email', 
        sortOrder: 'asc' 
      });
      expect(result[0].email).toBe('jane@example.com');
      expect(result[1].email).toBe('john@example.com');
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create paginated response with default values', () => {
      const result = service.createPaginatedResponse(mockUsers, {});
      
      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should create paginated response with custom values', () => {
      const result = service.createPaginatedResponse(mockUsers, { 
        page: 2, 
        limit: 1 
      });
      
      expect(result.users).toHaveSize(1);
      expect(result.total).toBe(2);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(1);
    });

    it('should handle empty users array', () => {
      const result = service.createPaginatedResponse([], { page: 1, limit: 10 });
      
      expect(result.users).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('searchUsers', () => {
    it('should return all users when query is empty', () => {
      const result = service.searchUsers(mockUsers, '');
      expect(result).toEqual(mockUsers);
    });

    it('should return all users when query is whitespace only', () => {
      const result = service.searchUsers(mockUsers, '   ');
      expect(result).toEqual(mockUsers);
    });

    it('should search by name (case insensitive)', () => {
      const result = service.searchUsers(mockUsers, 'jane');
      expect(result).toHaveSize(1);
      expect(result[0].name).toContain('Jane');
    });

    it('should search by email (case insensitive)', () => {
      const result = service.searchUsers(mockUsers, 'JOHN@EXAMPLE.COM');
      expect(result).toHaveSize(1);
      expect(result[0].email).toBe('john@example.com');
    });

    it('should return empty array when no matches found', () => {
      const result = service.searchUsers(mockUsers, 'nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('validateUser', () => {
    it('should validate valid user', () => {
      const validUser: User = {
        id: 1,
        name: 'Valid User',
        email: 'valid@example.com',
        status: 'active',
        phone: '',
        website: '',
        company: undefined,
        address: undefined
      };
      
      const result = service.validateUser(validUser);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect invalid name', () => {
      const invalidUser: User = {
        id: 1,
        name: 'A', // Too short
        email: 'valid@example.com',
        status: 'active',
        phone: '',
        website: '',
        company: undefined,
        address: undefined
      };
      
      const result = service.validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters long');
    });

    it('should detect invalid email', () => {
      const invalidUser: User = {
        id: 1,
        name: 'Valid User',
        email: 'invalid-email',
        status: 'active',
        phone: '',
        website: '',
        company: undefined,
        address: undefined
      };
      
      const result = service.validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email must be a valid email address');
    });

    it('should detect invalid status', () => {
      const invalidUser: User = {
        id: 1,
        name: 'Valid User',
        email: 'valid@example.com',
        status: 'invalid' as any,
        phone: '',
        website: '',
        company: undefined,
        address: undefined
      };
      
      const result = service.validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status must be either active or inactive');
    });

    it('should detect multiple validation errors', () => {
      const invalidUser: User = {
        id: 1,
        name: 'A',
        email: 'invalid-email',
        status: 'invalid' as any,
        phone: '',
        website: '',
        company: undefined,
        address: undefined
      };
      
      const result = service.validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveSize(3);
    });
  });
});
