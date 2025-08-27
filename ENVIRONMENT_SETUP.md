# Environment Configuration Guide

This document explains how to configure the User Management System for different environments.

## Overview

The application uses Angular's environment system to manage configuration for different deployment environments. This eliminates hardcoded values and provides a clean way to manage environment-specific settings.

## Environment Files

### Development Environment (`src/environments/environment.ts`)
- **API URL**: `https://jsonplaceholder.typicode.com` (demo API)
- **Mock Delay**: 500ms (simulates network latency)
- **Logging**: Enabled
- **Cache Timeout**: 5 minutes

### Production Environment (`src/environments/environment.prod.ts`)
- **API URL**: `https://api.yourproduction.com` (replace with your actual API)
- **Mock Delay**: 0ms (no artificial delay)
- **Logging**: Disabled
- **Cache Timeout**: 10 minutes

## Configuration Service

The `ConfigurationService` provides centralized access to all environment settings:

```typescript
@Injectable()
export class ConfigurationService {
  // Get base API URL
  getApiUrl(): string
  
  // Get full URL for specific endpoint
  getFullApiUrl(endpoint: keyof ApiEndpoints): string
  
  // Check if running in production
  isProduction(): boolean
  
  // Get mock delay for development
  getMockDelay(): number
  
  // Get pagination settings
  getPaginationConfig(): PaginationConfig
  
  // Get search settings
  getSearchConfig(): SearchConfig
}
```

## Constants

Application constants are centralized in `src/app/core/constants/app.constants.ts`:

```typescript
export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
  },
  SEARCH: {
    DEBOUNCE_TIME: 300
  },
  VALIDATION: {
    NAME: { MIN_LENGTH: 2, MAX_LENGTH: 50 }
  }
  // ... more constants
};
```

## Usage Examples

### In Services
```typescript
constructor(private configService: ConfigurationService) {
  this.apiUrl = this.configService.getFullApiUrl('users');
  this.mockDelay = this.configService.getMockDelay();
}
```

### In Components
```typescript
constructor(private configService: ConfigurationService) {
  this.pageSize = this.configService.getDefaultPageSize();
  this.pageSizeOptions = this.configService.getPageSizeOptions();
}
```

## Environment-Specific Builds

### Development Build
```bash
ng build
# Uses src/environments/environment.ts
```

### Production Build
```bash
ng build --configuration production
# Uses src/environments/environment.prod.ts
```

## Adding New Environments

1. Create a new environment file (e.g., `environment.staging.ts`)
2. Add configuration to `angular.json`:
```json
"staging": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.staging.ts"
    }
  ]
}
```

3. Build with: `ng build --configuration staging`

## Best Practices

1. **Never hardcode URLs** - Always use the configuration service
2. **Use constants** - Reference `APP_CONSTANTS` for magic numbers
3. **Environment-specific settings** - Use environment files for deployment differences
4. **Type safety** - All configuration is strongly typed
5. **Centralized management** - Single source of truth for all settings

## Migration from Hardcoded Values

The following hardcoded values have been replaced:

- ❌ `'https://jsonplaceholder.typicode.com/users'`
- ❌ `500` (mock delay)
- ❌ `300` (search debounce)
- ❌ `[5, 10, 25, 50]` (page size options)

With:

- ✅ `configService.getFullApiUrl('users')`
- ✅ `configService.getMockDelay()`
- ✅ `configService.getSearchDebounceTime()`
- ✅ `configService.getPageSizeOptions()`

## Troubleshooting

### Common Issues

1. **Import path errors**: Ensure relative paths are correct from environment files
2. **Build errors**: Check that environment files are properly configured in `angular.json`
3. **Runtime errors**: Verify that `ConfigurationService` is properly injected

### Debug Configuration

```typescript
// Log current configuration
console.log('Current config:', this.configService.getConfig());
console.log('Is production:', this.configService.isProduction());
console.log('API URL:', this.configService.getApiUrl());
```
