/**
 * Error Message Utility
 * Provides functions to convert error objects to user-friendly messages
 */

import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from '@/constants'

/**
 * Get error type from error object
 * @param {object} error - Error object
 * @returns {string} Error type/code
 */
export const getErrorType = (error) => {
  // Check for error code in nested error object
  if (error?.error?.code) {
    return error.error.code
  }

  // Check for HTTP status code
  if (error?.status) {
    if (error.status === HTTP_STATUS.NOT_FOUND) return ERROR_CODES.NOT_FOUND
    if (error.status === HTTP_STATUS.UNAUTHORIZED) return ERROR_CODES.UNAUTHORIZED
    if (error.status === HTTP_STATUS.FORBIDDEN) return ERROR_CODES.FORBIDDEN
    if (error.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) return ERROR_CODES.VALIDATION_ERROR
    if (error.status >= 500) return ERROR_CODES.SERVER_ERROR
    if (error.status >= 400) return ERROR_CODES.VALIDATION_ERROR
  }

  // Check for axios-specific error codes
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return ERROR_CODES.TIMEOUT_ERROR
  }

  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
    return ERROR_CODES.NETWORK_ERROR
  }

  // Check for network-related error messages
  if (error?.message && (
    error.message.includes('Network Error') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('network')
  )) {
    return ERROR_CODES.NETWORK_ERROR
  }

  // Default to unknown error
  return ERROR_CODES.UNKNOWN_ERROR
}

/**
 * Check if error is retryable
 * @param {object} error - Error object
 * @returns {boolean} True if error is retryable
 */
export const isRetryableError = (error) => {
  const errorType = getErrorType(error)

  // Retryable errors: network, timeout, connection, and server errors
  return [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.CONNECTION_ERROR,
    ERROR_CODES.SERVER_ERROR
  ].includes(errorType)
}

/**
 * Get user-friendly error message from error object
 * @param {object} error - Error object
 * @param {string} fallbackMessage - Optional fallback message
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, fallbackMessage = null) => {
  // If error is null/undefined, return fallback or default
  if (!error) {
    return fallbackMessage || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
  }

  // Check for user-friendly message in error object first
  if (error?.error?.message && typeof error.error.message === 'string') {
    // If it's already a user-friendly message, return it
    const message = error.error.message
    // Check if it's a technical error message that should be replaced
    if (message === 'Network error' || message === 'Network Error') {
      return ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]
    }
    return message
  }

  // Check for direct message property
  if (error?.message && typeof error.message === 'string') {
    // Check if it's a technical error message
    if (error.message === 'Network error' || error.message === 'Network Error') {
      return ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]
    }
    // If it looks like a user-friendly message, return it
    if (!error.message.includes('ECONNABORTED') && 
        !error.message.includes('ERR_NETWORK') &&
        !error.message.includes('Failed to fetch')) {
      return error.message
    }
  }

  // Get error type and return corresponding message
  const errorType = getErrorType(error)
  const message = ERROR_MESSAGES[errorType] || fallbackMessage || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]

  return message
}

/**
 * Extract validation errors from error object
 * @param {object} error - Error object
 * @returns {object} Object with field names as keys and error messages as values
 */
export const getValidationErrors = (error) => {
  if (error?.error?.errors && typeof error.error.errors === 'object') {
    return error.error.errors
  }
  return {}
}

/**
 * Check if error contains validation errors
 * @param {object} error - Error object
 * @returns {boolean} True if error contains validation errors
 */
export const hasValidationErrors = (error) => {
  const validationErrors = getValidationErrors(error)
  return Object.keys(validationErrors).length > 0
}
