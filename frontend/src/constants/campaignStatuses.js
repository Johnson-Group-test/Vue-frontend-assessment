/**
 * Campaign Status Constants
 */

export const CAMPAIGN_STATUSES = [
  {
    value: 'draft',
    label: 'Draft',
    description: 'Campaign is in draft mode and not active'
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Campaign is currently running'
  },
  {
    value: 'paused',
    label: 'Paused',
    description: 'Campaign is temporarily paused'
  },
  {
    value: 'completed',
    label: 'Completed',
    description: 'Campaign has finished running'
  }
]

export const STATUS_VALUES = CAMPAIGN_STATUSES.map(status => status.value)

export const STATUS_LABELS = CAMPAIGN_STATUSES.reduce((acc, status) => {
  acc[status.value] = status.label
  return acc
}, {})

export const STATUS_CLASS_MAP = {
  active: 'status-active',
  paused: 'status-paused',
  completed: 'status-completed',
  draft: 'status-draft'
}

export const STATUS_COLOR_MAP = {
  active: {
    background: 'var(--color-status-active-bg)',
    text: 'var(--color-status-active-text)'
  },
  paused: {
    background: 'var(--color-status-paused-bg)',
    text: 'var(--color-status-paused-text)'
  },
  completed: {
    background: 'var(--color-status-completed-bg)',
    text: 'var(--color-status-completed-text)'
  },
  draft: {
    background: 'var(--color-status-draft-bg)',
    text: 'var(--color-status-draft-text)'
  }
}

/**
 * Get status label by value
 * @param {string} value - Status value
 * @returns {string} Status label
 */
export const getStatusLabel = (value) => {
  return STATUS_LABELS[value] || value
}

/**
 * Get status CSS class by value
 * @param {string} value - Status value
 * @returns {string} CSS class name
 */
export const getStatusClass = (value) => {
  return STATUS_CLASS_MAP[value] || 'status-default'
}

/**
 * Check if status value is valid
 * @param {string} value - Status value to validate
 * @returns {boolean} True if valid
 */
export const isValidStatus = (value) => {
  return STATUS_VALUES.includes(value)
}
