/**
 * Constants Index
 * Central export file for all constants
 */

// Campaign Statuses
export * from './campaignStatuses.js'

// Validation Rules
export * from './validationRules.js'

// API Endpoints
export const API_ENDPOINTS = {
  campaigns: {
    list: '/campaigns',
    detail: (id) => `/campaigns/${id}`,
    create: '/campaigns',
    update: (id) => `/campaigns/${id}`,
    delete: (id) => `/campaigns/${id}`,
    search: (query) => `/campaigns/search?q=${encodeURIComponent(query)}`
  },
  health: '/health'
}

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100
}

// Form Defaults
export const FORM_DEFAULTS = {
  status: 'draft',
  debounceDelay: 300 // ms
}

// Date Formats
export const DATE_FORMATS = {
  display: {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  input: 'YYYY-MM-DD',
  api: 'YYYY-MM-DD'
}

// Currency Format
export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}

// Number Format
export const NUMBER_FORMAT = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
}

// Percentage Format
export const PERCENTAGE_FORMAT = {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
}

// Local Storage Keys
export const STORAGE_KEYS = {
  searchQuery: 'campaign_search_query',
  filters: 'campaign_filters',
  preferences: 'campaign_preferences'
}

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
}
