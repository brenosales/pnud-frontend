import { APP_CONSTANTS } from '../app/core/constants/app.constants';

export const environment = {
  production: true,
  apiUrl: 'https://jsonplaceholder.typicode.com',
  apiEndpoints: {
    users: '/users'
  },
  mockDelay: 0, // No mock delay in production
  enableLogging: false,
  cacheTimeout: APP_CONSTANTS.CACHE.USER_DETAIL_TTL, // 10 minutes in production
  pagination: {
    defaultPageSize: APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    pageSizeOptions: APP_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
  },
  search: {
    debounceTime: APP_CONSTANTS.SEARCH.DEBOUNCE_TIME
  }
}; 
