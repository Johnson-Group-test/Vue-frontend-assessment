/**
 * Campaign Service
 * Centralized API methods for campaign operations
 */

import api from './api.js'
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from '@/constants'

/**
 * Campaign Service Object
 * Provides all campaign-related API methods
 */
export const campaignService = {
  /**
   * Get all campaigns with optional filters and pagination
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.status - Filter by status (optional)
   * @param {string} params.search - Search query (optional)
   * @returns {Promise<object>} Response with data array and pagination info
   */
  getCampaigns: async (params = {}) => {
    const {
      page = PAGINATION_DEFAULTS.page,
      limit = PAGINATION_DEFAULTS.limit,
      status = null,
      search = null
    } = params

    // Build query string
    const queryParams = new URLSearchParams()
    
    if (page) queryParams.append('page', page)
    if (limit) queryParams.append('limit', limit)
    if (status) queryParams.append('status', status)
    if (search) queryParams.append('search', search)

    const queryString = queryParams.toString()
    const url = queryString 
      ? `${API_ENDPOINTS.campaigns.list}?${queryString}`
      : API_ENDPOINTS.campaigns.list

    const response = await api.get(url)
    
    // The API interceptor returns response.data, so response is already the data object
    // Response structure: { data: [...], pagination: {...} }
    return response
  },

  /**
   * Get a single campaign by ID
   * @param {string|number} id - Campaign ID
   * @returns {Promise<object>} Campaign object with metrics
   */
  getCampaignById: async (id) => {
    if (!id) {
      throw new Error('Campaign ID is required')
    }

    const response = await api.get(API_ENDPOINTS.campaigns.detail(id))
    
    // The API interceptor returns response.data, so response is already the data object
    // Response structure: { data: {...} }
    return response
  },

  /**
   * Create a new campaign
   * @param {object} data - Campaign data
   * @param {string} data.name - Campaign name (required)
   * @param {string} data.status - Campaign status (required)
   * @param {number} data.budget - Campaign budget (required)
   * @param {string} data.startDate - Start date (required, YYYY-MM-DD)
   * @param {string} data.endDate - End date (required, YYYY-MM-DD)
   * @param {string} data.description - Campaign description (optional)
   * @param {string} data.targetAudience - Target audience (optional)
   * @returns {Promise<object>} Created campaign object
   */
  createCampaign: async (data) => {
    if (!data.name) {
      throw new Error('Campaign name is required')
    }
    if (!data.status) {
      throw new Error('Campaign status is required')
    }
    if (!data.budget) {
      throw new Error('Campaign budget is required')
    }
    if (!data.startDate) {
      throw new Error('Start date is required')
    }
    if (!data.endDate) {
      throw new Error('End date is required')
    }

    // Prepare payload - ensure budget is a number
    const payload = {
      name: data.name.trim(),
      status: data.status,
      budget: Number(data.budget),
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description?.trim() || undefined,
      targetAudience: data.targetAudience?.trim() || undefined
    }

    const response = await api.post(API_ENDPOINTS.campaigns.create, payload)
    
    // The API interceptor returns response.data, so response is already the data object
    // Response structure: { data: {...} }
    return response
  },

  /**
   * Update an existing campaign
   * @param {string|number} id - Campaign ID
   * @param {object} data - Campaign data to update
   * @returns {Promise<object>} Updated campaign object
   */
  updateCampaign: async (id, data) => {
    if (!id) {
      throw new Error('Campaign ID is required')
    }

    // Prepare payload - ensure budget is a number if provided
    const payload = { ...data }
    
    if (payload.budget !== undefined) {
      payload.budget = Number(payload.budget)
    }
    
    if (payload.name) {
      payload.name = payload.name.trim()
    }
    
    if (payload.description) {
      payload.description = payload.description.trim()
    }
    
    if (payload.targetAudience) {
      payload.targetAudience = payload.targetAudience.trim()
    }

    const response = await api.put(API_ENDPOINTS.campaigns.update(id), payload)
    
    // The API interceptor returns response.data, so response is already the data object
    // Response structure: { data: {...} }
    return response
  },

  /**
   * Delete a campaign
   * @param {string|number} id - Campaign ID
   * @returns {Promise<object>} Deletion confirmation
   */
  deleteCampaign: async (id) => {
    if (!id) {
      throw new Error('Campaign ID is required')
    }

    const response = await api.delete(API_ENDPOINTS.campaigns.delete(id))
    
    // The API interceptor returns response.data, so response is already the data object
    return response
  },

  /**
   * Search campaigns by query string
   * @param {string} query - Search query
   * @param {object} params - Additional query parameters
   * @returns {Promise<object>} Response with filtered campaigns
   */
  searchCampaigns: async (query, params = {}) => {
    if (!query || !query.trim()) {
      // If no query, just get all campaigns
      return campaignService.getCampaigns(params)
    }

    // Use the list endpoint with search parameter
    return campaignService.getCampaigns({
      ...params,
      search: query.trim()
    })
  },

  /**
   * Get campaigns by status
   * @param {string} status - Status filter (active, paused, completed, draft)
   * @param {object} params - Additional query parameters
   * @returns {Promise<object>} Response with filtered campaigns
   */
  getCampaignsByStatus: async (status, params = {}) => {
    return campaignService.getCampaigns({
      ...params,
      status
    })
  }
}

/**
 * Helper function to handle API errors consistently
 * @param {Error} error - Error object from API
 * @returns {object} Formatted error object
 */
export const handleCampaignError = (error) => {
  // The API interceptor already formats errors
  if (error?.error) {
    return {
      message: error.error.message || 'An error occurred',
      code: error.error.code || 'UNKNOWN_ERROR',
      errors: error.error.errors || {}
    }
  }

  return {
    message: error?.message || 'An error occurred',
    code: 'UNKNOWN_ERROR',
    errors: {}
  }
}

export default campaignService
