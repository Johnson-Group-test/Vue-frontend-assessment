/**
 * useApi Composable
 * Provides generic API loading, error, and retry state management
 */

import { ref } from 'vue'
import { ERROR_CODES, HTTP_STATUS } from '@/constants'

/**
 * Generic API composable for handling async operations
 * @param {Function} apiFunction - Async function that makes API call
 * @param {object} options - Configuration options
 * @param {boolean} options.initialLoading - Initial loading state (default: false)
 * @param {Function} options.onSuccess - Callback on success
 * @param {Function} options.onError - Callback on error
 * @returns {object} API state and methods
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    initialLoading = false,
    onSuccess,
    onError
  } = options

  // State
  const data = ref(null)
  const loading = ref(initialLoading)
  const error = ref(null)
  const notFound = ref(false)

  // Abort controller for request cancellation
  let abortController = null

  /**
   * Execute the API function
   * @param {...any} args - Arguments to pass to the API function
   * @returns {Promise<any>} API response
   */
  const execute = async (...args) => {
    // Cancel previous request if it exists
    if (abortController) {
      abortController.abort()
    }

    // Create new abort controller
    abortController = new AbortController()

    // Reset state
    loading.value = true
    error.value = null
    notFound.value = false

    try {
      const response = await apiFunction(...args)
      
      data.value = response
      error.value = null
      notFound.value = false

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response)
      }

      return response
    } catch (err) {
      // Handle aborted requests
      if (err.name === 'AbortError') {
        return
      }

      // Handle different error types
      if (err?.error?.code === ERROR_CODES.NOT_FOUND || err?.status === HTTP_STATUS.NOT_FOUND) {
        notFound.value = true
        error.value = null
      } else {
        error.value = err?.error?.message || err?.message || 'An error occurred. Please try again.'
        notFound.value = false
      }

      // Call error callback if provided
      if (onError && typeof onError === 'function') {
        onError(err)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Retry the last API call
   * @param {...any} args - Arguments to pass to the API function
   * @returns {Promise<any>} API response
   */
  const retry = async (...args) => {
    return execute(...args)
  }

  /**
   * Reset all state
   */
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
    notFound.value = false
    
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  /**
   * Cancel current request
   */
  const cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    loading.value = false
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
    notFound.value = false
  }

  return {
    // State
    data,
    loading,
    error,
    notFound,
    
    // Methods
    execute,
    retry,
    reset,
    cancel,
    clearError
  }
}

/**
 * Create a simple loading state composable
 * @returns {object} Loading state and methods
 */
export const useLoading = () => {
  const loading = ref(false)

  const start = () => {
    loading.value = true
  }

  const stop = () => {
    loading.value = false
  }

  const toggle = () => {
    loading.value = !loading.value
  }

  return {
    loading,
    start,
    stop,
    toggle
  }
}

/**
 * Create a simple error state composable
 * @returns {object} Error state and methods
 */
export const useError = () => {
  const error = ref(null)
  const notFound = ref(false)

  const setError = (message, code = null) => {
    error.value = message
    
    if (code === ERROR_CODES.NOT_FOUND || code === HTTP_STATUS.NOT_FOUND) {
      notFound.value = true
    } else {
      notFound.value = false
    }
  }

  const clearError = () => {
    error.value = null
    notFound.value = false
  }

  const setNotFound = (isNotFound = true) => {
    notFound.value = isNotFound
    if (isNotFound) {
      error.value = null
    }
  }

  return {
    error,
    notFound,
    setError,
    clearError,
    setNotFound
  }
}
