import { Injectable } from '@angular/core';
import { User, UserFilters, UserListResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserBusinessService {
  /**
   * Map API users to our User interface
   */
  mapApiUsersToUsers(apiUsers: any[]): User[] {
    return apiUsers.map(apiUser => ({
      id: apiUser.id,
      name: apiUser.name || apiUser.username || 'Unknown Name',
      email: apiUser.email || '',
      status: this.generateStatus(apiUser.id),
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
   * Generate status for demo purposes
   */
  generateStatus(userId: number): 'active' | 'inactive' {
    // Use userId to ensure same user always has same status
    return userId % 2 === 0 ? 'active' : 'inactive';
  }

  /**
   * Apply filters to users
   */
  applyFilters(users: User[], filters: UserFilters): User[] {
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
  createPaginatedResponse(users: User[], filters: UserFilters): UserListResponse {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total: users.length,
      page,
      limit
    };
  }

  /**
   * Search users by name or email
   */
  searchUsers(users: User[], query: string): User[] {
    if (!query.trim()) {
      return users;
    }

    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Validate user data
   */
  validateUser(user: User): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!user.name || user.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!user.email || !this.isValidEmail(user.email)) {
      errors.push('Email must be a valid email address');
    }

    if (!user.status || !['active', 'inactive'].includes(user.status)) {
      errors.push('Status must be either active or inactive');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
