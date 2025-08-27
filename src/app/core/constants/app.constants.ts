/**
 * Application constants
 * Centralized location for commonly used values
 */

export const APP_CONSTANTS = {
  // API related
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
    MAX_PAGE_SIZE: 100,
  },
  
  // Search
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100,
    DEBOUNCE_TIME: 300,
  },
  
  // Validation
  VALIDATION: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s]+$/,
    },
    EMAIL: {
      MAX_LENGTH: 100,
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    PHONE: {
      PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
    },
  },
  
  // UI
  UI: {
    SNACKBAR_DURATION: 3000, // 3 seconds
    TOOLTIP_DELAY: 500, // 500ms
    ANIMATION_DURATION: 200, // 200ms
  },
  
  // Cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    USER_LIST_TTL: 2 * 60 * 1000, // 2 minutes
    USER_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erro de rede ocorreu. Verifique sua conexão.',
    SERVER_ERROR: 'Erro do servidor ocorreu. Tente novamente mais tarde.',
    VALIDATION_ERROR: 'Verifique sua entrada e tente novamente.',
    NOT_FOUND: 'O recurso solicitado não foi encontrado.',
    UNAUTHORIZED: 'Você não está autorizado a executar esta ação.',
    FORBIDDEN: 'Acesso a este recurso é proibido.',
    DELETE_FAILED: 'Falha ao excluir usuário.',
    LOAD_FAILED: 'Falha ao carregar usuário.',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    USER_CREATED: 'Usuário criado com sucesso!',
    USER_UPDATED: 'Usuário atualizado com sucesso!',
    USER_DELETED: 'Usuário excluído com sucesso!',
    CHANGES_SAVED: 'Alterações salvas com sucesso!',
  },

  // Confirmation messages
  CONFIRMATION_MESSAGES: {
    DELETE_USER: 'Tem certeza de que deseja excluir {name}?',
    DELETE_USER_DETAILED: 'Tem certeza de que deseja excluir {name}? Esta ação não pode ser desfeita.',
    ACTION_IRREVERSIBLE: 'Esta ação não pode ser desfeita.',
  },
} as const;

// Type-safe access to constants
export type AppConstants = typeof APP_CONSTANTS;
