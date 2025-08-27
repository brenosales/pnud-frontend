import { APP_CONSTANTS } from '../app/core/constants/app.constants';

export const environment = {
  production: false,
  apiUrl: 'https://jsonplaceholder.typicode.com',
  apiEndpoints: {
    users: '/users'
  },
  mockDelay: 500,
  enableLogging: true,
  cacheTimeout: APP_CONSTANTS.CACHE.DEFAULT_TTL,
  pagination: {
    defaultPageSize: APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    pageSizeOptions: APP_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
  },
  search: {
    debounceTime: APP_CONSTANTS.SEARCH.DEBOUNCE_TIME
  }
}; 
