export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
}

export interface UserFormData {
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  name?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'status';
  sortOrder?: 'asc' | 'desc';
}
