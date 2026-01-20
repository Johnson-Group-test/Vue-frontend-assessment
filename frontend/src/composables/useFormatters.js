/**
 * useFormatters Composable
 * Provides formatting functions for currency, dates, percentages, and numbers
 */

import { CURRENCY_FORMAT, NUMBER_FORMAT, PERCENTAGE_FORMAT, DATE_FORMATS } from '@/constants'

/**
 * Format a number as USD currency
 * @param {number|string} amount - Amount to format
 * @param {object} options - Intl.NumberFormat options (optional)
 * @returns {string} Formatted currency string (e.g., "$50,000")
 */
export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined || amount === '') {
    return '$0.00'
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return '$0.00'
  }
  
  const formatOptions = {
    ...CURRENCY_FORMAT,
    ...options
  }
  
  return new Intl.NumberFormat('en-US', formatOptions).format(numAmount)
}

/**
 * Format a date string
 * @param {string|Date} dateString - Date to format
 * @param {string} format - Format type ('short', 'long', 'full') or custom Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) {
    return ''
  }
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  // If format is a predefined string, use DATE_FORMATS
  if (typeof format === 'string' && DATE_FORMATS.display[format]) {
    return date.toLocaleDateString('en-US', DATE_FORMATS.display[format])
  }
  
  // If format is an object, use it directly
  if (typeof format === 'object') {
    return date.toLocaleDateString('en-US', format)
  }
  
  // Default to short format
  return date.toLocaleDateString('en-US', DATE_FORMATS.display.short)
}

/**
 * Format a number as percentage
 * @param {number|string} value - Value to format (should be a decimal, e.g., 2.8 for 2.8%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string (e.g., "2.80%")
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || value === '') {
    return '0%'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '0%'
  }
  
  return `${numValue.toFixed(decimals)}%`
}

/**
 * Format a number with thousand separators
 * @param {number|string} value - Number to format
 * @param {object} options - Intl.NumberFormat options (optional)
 * @returns {string} Formatted number string (e.g., "125,000")
 */
export const formatNumber = (value, options = {}) => {
  if (value === null || value === undefined || value === '') {
    return '0'
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '0'
  }
  
  const formatOptions = {
    ...NUMBER_FORMAT,
    ...options
  }
  
  return new Intl.NumberFormat('en-US', formatOptions).format(numValue)
}

/**
 * Format a date range
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} Formatted date range string
 */
export const formatDateRange = (startDate, endDate, format = 'short') => {
  const start = formatDate(startDate, format)
  const end = formatDate(endDate, format)
  
  if (!start || !end) {
    return start || end || ''
  }
  
  return `${start} - ${end}`
}

/**
 * Composable function that returns all formatting utilities
 * @returns {object} Object containing all formatting functions
 */
export const useFormatters = () => {
  return {
    formatCurrency,
    formatDate,
    formatPercentage,
    formatNumber,
    formatDateRange
  }
}
