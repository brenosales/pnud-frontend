import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ApiEndpoints {
  users: string;
}

export interface PaginationConfig {
  defaultPageSize: number;
  pageSizeOptions: readonly number[];
}

export interface SearchConfig {
  debounceTime: number;
}

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  apiEndpoints: ApiEndpoints;
  mockDelay: number;
  enableLogging: boolean;
  cacheTimeout: number;
  pagination: PaginationConfig;
  search: SearchConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: AppConfig = environment;

  /**
   * Get the complete application configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get the base API URL
   */
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get a specific API endpoint
   */
  getApiEndpoint(endpoint: keyof ApiEndpoints): string {
    return this.config.apiEndpoints[endpoint];
  }

  /**
   * Get the full URL for a specific endpoint
   */
  getFullApiUrl(endpoint: keyof ApiEndpoints): string {
    return `${this.config.apiUrl}${this.config.apiEndpoints[endpoint]}`;
  }

  /**
   * Check if the application is running in production mode
   */
  isProduction(): boolean {
    return this.config.production;
  }

  /**
   * Get the mock delay for development/testing
   */
  getMockDelay(): number {
    return this.config.mockDelay;
  }

  /**
   * Check if logging is enabled
   */
  isLoggingEnabled(): boolean {
    return this.config.enableLogging;
  }

  /**
   * Get the cache timeout in milliseconds
   */
  getCacheTimeout(): number {
    return this.config.cacheTimeout;
  }

  /**
   * Get pagination configuration
   */
  getPaginationConfig(): PaginationConfig {
    return this.config.pagination;
  }

  /**
   * Get search configuration
   */
  getSearchConfig(): SearchConfig {
    return this.config.search;
  }

  /**
   * Get the default page size
   */
  getDefaultPageSize(): number {
    return this.config.pagination.defaultPageSize;
  }

  /**
   * Get available page size options
   */
  getPageSizeOptions(): readonly number[] {
    return this.config.pagination.pageSizeOptions;
  }

  /**
   * Get search debounce time
   */
  getSearchDebounceTime(): number {
    return this.config.search.debounceTime;
  }
} 
