/**
 * useFormValidation Composable
 * Provides form validation utilities and state management
 */

import { ref, computed } from 'vue'
import {
  VALIDATION_MESSAGES,
  FIELD_NAMES,
  validateCampaignName,
  validateBudget,
  validateDate,
  validateEndDate,
  validateStatus
} from '@/constants'

/**
 * Form validation composable
 * @param {object} initialErrors - Initial errors object
 * @returns {object} Validation state and methods
 */
export const useFormValidation = (initialErrors = {}) => {
  const errors = ref({ ...initialErrors })

  /**
   * Set error for a specific field
   * @param {string} field - Field name
   * @param {string} message - Error message
   */
  const setError = (field, message) => {
    errors.value[field] = message
  }

  /**
   * Clear error for a specific field
   * @param {string} field - Field name
   */
  const clearError = (field) => {
    delete errors.value[field]
  }

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    errors.value = {}
  }

  /**
   * Check if a field has an error
   * @param {string} field - Field name
   * @returns {boolean} True if field has error
   */
  const hasError = (field) => {
    return !!errors.value[field]
  }

  /**
   * Get error message for a field
   * @param {string} field - Field name
   * @returns {string|null} Error message or null
   */
  const getError = (field) => {
    return errors.value[field] || null
  }

  /**
   * Check if form is valid (no errors)
   * @returns {boolean} True if form has no errors
   */
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  /**
   * Check if form has any errors
   * @returns {boolean} True if form has errors
   */
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  // Specific validation functions
  const validateFieldName = (value) => {
    const error = validateCampaignName(value)
    if (error) {
      setError('name', error)
      return false
    }
    clearError('name')
    return true
  }

  const validateFieldBudget = (value) => {
    const error = validateBudget(value)
    if (error) {
      setError('budget', error)
      return false
    }
    clearError('budget')
    return true
  }

  const validateFieldStartDate = (value) => {
    const error = validateDate(value)
    if (error) {
      setError('startDate', error)
      return false
    }
    clearError('startDate')
    return true
  }

  const validateFieldEndDate = (endDate, startDate) => {
    const error = validateEndDate(endDate, startDate)
    if (error) {
      setError('endDate', error)
      return false
    }
    clearError('endDate')
    return true
  }

  const validateFieldStatus = (value) => {
    const error = validateStatus(value)
    if (error) {
      setError('status', error)
      return false
    }
    clearError('status')
    return true
  }

  /**
   * Validate a field by name
   * @param {string} fieldName - Field name
   * @param {any} value - Field value
   * @param {any} additionalValue - Additional value for dependent validations (e.g., endDate needs startDate)
   * @returns {boolean} True if valid
   */
  const validateField = (fieldName, value, additionalValue = null) => {
    switch (fieldName) {
      case 'name':
        return validateFieldName(value)
      case 'budget':
        return validateFieldBudget(value)
      case 'startDate':
        return validateFieldStartDate(value)
      case 'endDate':
        return validateFieldEndDate(value, additionalValue)
      case 'status':
        return validateFieldStatus(value)
      default:
        return true
    }
  }

  /**
   * Validate all campaign form fields
   * @param {object} formData - Form data object
   * @returns {boolean} True if all fields are valid
   */
  const validateCampaignForm = (formData) => {
    clearAllErrors()

    const validations = [
      validateFieldName(formData.name),
      validateFieldBudget(formData.budget),
      validateFieldStartDate(formData.startDate),
      validateFieldEndDate(formData.endDate, formData.startDate),
      validateFieldStatus(formData.status)
    ]

    return validations.every(result => result === true)
  }

  return {
    // State
    errors,
    isValid,
    hasErrors,

    // Methods
    setError,
    clearError,
    clearAllErrors,
    hasError,
    getError,
    validateField,
    validateCampaignForm,

    // Specific validators
    validateFieldName,
    validateFieldBudget,
    validateFieldStartDate,
    validateFieldEndDate,
    validateFieldStatus
  }
}

/**
 * Debounce composable for input validation
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function with cancel method
 */
export const useDebounce = (fn, delay = 300) => {
  let timeoutId = null

  const debouncedFn = (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  // Add cancel method for cleanup
  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debouncedFn
}
