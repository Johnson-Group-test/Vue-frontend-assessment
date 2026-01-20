/**
 * useStatusClass Composable
 * Provides status-related utility functions
 */

import {
  CAMPAIGN_STATUSES,
  STATUS_CLASS_MAP,
  STATUS_LABELS,
  STATUS_COLOR_MAP,
  getStatusLabel as getStatusLabelUtil,
  getStatusClass as getStatusClassUtil,
  isValidStatus
} from '@/constants'

/**
 * Get CSS class for a status value
 * @param {string} status - Status value
 * @returns {string} CSS class name
 */
export const getStatusClass = (status) => {
  return getStatusClassUtil(status)
}

/**
 * Get display label for a status value
 * @param {string} status - Status value
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  return getStatusLabelUtil(status)
}

/**
 * Get color values for a status
 * @param {string} status - Status value
 * @returns {object|null} Object with background and text colors, or null if invalid
 */
export const getStatusColors = (status) => {
  if (!isValidStatus(status)) {
    return null
  }
  
  return STATUS_COLOR_MAP[status] || null
}

/**
 * Get all status options for select dropdowns
 * @returns {array} Array of status objects with value and label
 */
export const getStatusOptions = () => {
  return CAMPAIGN_STATUSES.map(status => ({
    value: status.value,
    label: status.label,
    description: status.description
  }))
}

/**
 * Check if status is valid
 * @param {string} status - Status value to validate
 * @returns {boolean} True if valid
 */
export const validateStatus = (status) => {
  return isValidStatus(status)
}

/**
 * Get status badge configuration
 * @param {string} status - Status value
 * @returns {object} Status badge config with class, label, and colors
 */
export const getStatusBadgeConfig = (status) => {
  if (!isValidStatus(status)) {
    return {
      class: 'status-default',
      label: status || 'Unknown',
      colors: null
    }
  }
  
  return {
    class: getStatusClass(status),
    label: getStatusLabel(status),
    colors: getStatusColors(status)
  }
}

/**
 * Composable function that returns all status utilities
 * @returns {object} Object containing all status utility functions
 */
export const useStatusClass = () => {
  return {
    getStatusClass,
    getStatusLabel,
    getStatusColors,
    getStatusOptions,
    validateStatus,
    getStatusBadgeConfig,
    // Constants
    CAMPAIGN_STATUSES,
    STATUS_CLASS_MAP,
    STATUS_LABELS
  }
}
