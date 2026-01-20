/**
 * Validation Rules and Messages
 */

export const VALIDATION_MESSAGES = {
  required: (field) => `${field} is required`,
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must not exceed ${min} characters`,
  min: (field, min) => `${field} must be at least ${min}`,
  max: (field, max) => `${field} must not exceed ${max}`,
  positiveNumber: (field) => `${field} must be a positive number`,
  validDate: (field) => `${field} must be a valid date`,
  dateAfter: (field, afterField) => `${field} must be after ${afterField}`,
  dateBefore: (field, beforeField) => `${field} must be before ${beforeField}`,
  invalidFormat: (field) => `${field} format is invalid`,
  invalidStatus: () => 'Invalid status value',
  networkError: () => 'Network error. Please check your connection.',
  serverError: () => 'Server error. Please try again later.',
  notFound: () => 'Resource not found',
  unauthorized: () => 'You are not authorized to perform this action',
  forbidden: () => 'Access forbidden',
  generic: () => 'An error occurred. Please try again.'
}

export const FIELD_NAMES = {
  name: 'Campaign name',
  status: 'Status',
  budget: 'Budget',
  startDate: 'Start date',
  endDate: 'End date',
  description: 'Description',
  targetAudience: 'Target audience'
}

export const VALIDATION_RULES = {
  campaignName: {
    required: true,
    minLength: 3,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-_]+$/
  },
  budget: {
    required: true,
    min: 1,
    type: 'number'
  },
  startDate: {
    required: true,
    type: 'date'
  },
  endDate: {
    required: true,
    type: 'date',
    after: 'startDate'
  },
  status: {
    required: true,
    oneOf: ['active', 'paused', 'completed', 'draft']
  },
  description: {
    required: false,
    maxLength: 1000
  },
  targetAudience: {
    required: false,
    maxLength: 255
  }
}

/**
 * Validate campaign name
 * @param {string} value - Campaign name
 * @returns {string|null} Error message or null if valid
 */
export const validateCampaignName = (value) => {
  if (!value || !value.trim()) {
    return VALIDATION_MESSAGES.required(FIELD_NAMES.name)
  }
  
  if (value.trim().length < VALIDATION_RULES.campaignName.minLength) {
    return VALIDATION_MESSAGES.minLength(
      FIELD_NAMES.name, 
      VALIDATION_RULES.campaignName.minLength
    )
  }
  
  if (value.trim().length > VALIDATION_RULES.campaignName.maxLength) {
    return VALIDATION_MESSAGES.maxLength(
      FIELD_NAMES.name,
      VALIDATION_RULES.campaignName.maxLength
    )
  }
  
  if (!VALIDATION_RULES.campaignName.pattern.test(value.trim())) {
    return VALIDATION_MESSAGES.invalidFormat(FIELD_NAMES.name)
  }
  
  return null
}

/**
 * Validate budget
 * @param {number|string} value - Budget value
 * @returns {string|null} Error message or null if valid
 */
export const validateBudget = (value) => {
  if (!value && value !== 0) {
    return VALIDATION_MESSAGES.required(FIELD_NAMES.budget)
  }
  
  const budget = Number(value)
  
  if (isNaN(budget)) {
    return VALIDATION_MESSAGES.positiveNumber(FIELD_NAMES.budget)
  }
  
  if (budget < VALIDATION_RULES.budget.min) {
    return VALIDATION_MESSAGES.min(FIELD_NAMES.budget, VALIDATION_RULES.budget.min)
  }
  
  return null
}

/**
 * Validate date
 * @param {string} value - Date string
 * @returns {string|null} Error message or null if valid
 */
export const validateDate = (value) => {
  if (!value) {
    return VALIDATION_MESSAGES.required(FIELD_NAMES.startDate)
  }
  
  const date = new Date(value)
  
  if (isNaN(date.getTime())) {
    return VALIDATION_MESSAGES.validDate(FIELD_NAMES.startDate)
  }
  
  return null
}

/**
 * Validate end date is after start date
 * @param {string} endDate - End date string
 * @param {string} startDate - Start date string
 * @returns {string|null} Error message or null if valid
 */
export const validateEndDate = (endDate, startDate) => {
  if (!endDate) {
    return VALIDATION_MESSAGES.required(FIELD_NAMES.endDate)
  }
  
  const end = new Date(endDate)
  const start = new Date(startDate)
  
  if (isNaN(end.getTime())) {
    return VALIDATION_MESSAGES.validDate(FIELD_NAMES.endDate)
  }
  
  if (startDate && end < start) {
    return VALIDATION_MESSAGES.dateAfter(FIELD_NAMES.endDate, FIELD_NAMES.startDate)
  }
  
  return null
}

/**
 * Validate status
 * @param {string} value - Status value
 * @returns {string|null} Error message or null if valid
 */
export const validateStatus = (value) => {
  if (!value) {
    return VALIDATION_MESSAGES.required(FIELD_NAMES.status)
  }
  
  if (!VALIDATION_RULES.status.oneOf.includes(value)) {
    return VALIDATION_MESSAGES.invalidStatus()
  }
  
  return null
}
