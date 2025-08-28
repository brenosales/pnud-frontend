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

  getConfig(): AppConfig {
    return this.config;
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getApiEndpoint(endpoint: keyof ApiEndpoints): string {
    return this.config.apiEndpoints[endpoint];
  }

  getFullApiUrl(endpoint: keyof ApiEndpoints): string {
    return `${this.config.apiUrl}${this.config.apiEndpoints[endpoint]}`;
  }

  isProduction(): boolean {
    return this.config.production;
  }

  getMockDelay(): number {
    return this.config.mockDelay;
  }

  isLoggingEnabled(): boolean {
    return this.config.enableLogging;
  }

  getCacheTimeout(): number {
    return this.config.cacheTimeout;
  }

  getPaginationConfig(): PaginationConfig {
    return this.config.pagination;
  }

  getSearchConfig(): SearchConfig {
    return this.config.search;
  }

  getDefaultPageSize(): number {
    return this.config.pagination.defaultPageSize;
  }

  getPageSizeOptions(): readonly number[] {
    return this.config.pagination.pageSizeOptions;
  }

  getSearchDebounceTime(): number {
    return this.config.search.debounceTime;
  }
} 
