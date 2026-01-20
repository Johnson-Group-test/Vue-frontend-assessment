/**
 * Campaigns Store
 * Centralized state management for campaigns
 */

import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import campaignService from '@/services/campaignService'
import { ERROR_CODES, HTTP_STATUS } from '@/constants'

export const useCampaignsStore = defineStore('campaigns', () => {
  // ========== State ==========
  
  /** @type {Array} List of all campaigns */
  // Using shallowRef for better performance since we replace the entire array
  const campaigns = shallowRef([])
  
  /** @type {Object|null} Currently selected campaign */
  const currentCampaign = ref(null)
  
  /** @type {boolean} Loading state */
  const loading = ref(false)
  
  /** @type {string|null} Error message */
  const error = ref(null)
  
  /** @type {boolean} Not found state */
  const notFound = ref(false)
  
  /** @type {string} Search query for filtering */
  const searchQuery = ref('')
  
  /** @type {object} Filters object */
  const filters = ref({
    status: null,
    page: 1,
    limit: 10
  })
  
  /** @type {object} Pagination info */
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  // ========== Getters ==========
  
  /**
   * Get filtered campaigns based on search query
   * @returns {Array} Filtered campaigns
   */
  const filteredCampaigns = computed(() => {
    const query = searchQuery.value.trim()
    
    // Early return if no search query
    if (!query) {
      return campaigns.value
    }
    
    // Memoize lowercase query for performance
    const lowerQuery = query.toLowerCase()
    
    // Filter campaigns - using filter for immutable operation
    return campaigns.value.filter(campaign => 
      campaign.name?.toLowerCase().includes(lowerQuery) ?? false
    )
  })
  
  /**
   * Get campaign by ID from cache
   * @param {string|number} id - Campaign ID
   * @returns {Function} Function that takes an ID and returns the campaign
   */
  const getCampaignById = (id) => {
    return campaigns.value.find(campaign => campaign.id === String(id))
  }
  
  /**
   * Get total campaign count
   * @returns {number} Total number of campaigns
   */
  const campaignCount = computed(() => {
    return campaigns.value.length
  })
  
  /**
   * Get only active campaigns
   * @returns {Array} Active campaigns
   */
  const activeCampaigns = computed(() => {
    return campaigns.value.filter(campaign => campaign.status === 'active')
  })
  
  /**
   * Get campaigns by status
   * @param {string} status - Status to filter by
   * @returns {Array} Campaigns with the specified status
   */
  const getCampaignsByStatus = (status) => {
    return campaigns.value.filter(campaign => campaign.status === status)
  }
  
  /**
   * Check if campaigns are loaded
   * @returns {boolean} True if campaigns are loaded
   */
  const hasCampaigns = computed(() => {
    return campaigns.value.length > 0
  })

  // ========== Actions ==========
  
  /**
   * Fetch all campaigns from API
   * @param {object} params - Optional query parameters
   * @returns {Promise<void>}
   */
  const fetchCampaigns = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Merge params with filters
      const queryParams = {
        ...filters.value,
        ...params
      }
      
      // Add search query if present
      if (searchQuery.value.trim()) {
        queryParams.search = searchQuery.value.trim()
      }
      
      const response = await campaignService.getCampaigns(queryParams)
      
      // The response structure: { data: [...], pagination: {...} }
      campaigns.value = response.data || []
      pagination.value = response.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      }
      
      error.value = null
    } catch (err) {
      error.value = err?.error?.message || 'Failed to load campaigns. Please try again.'
      console.error('Error fetching campaigns:', err)
      campaigns.value = []
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch a single campaign by ID
   * @param {string|number} id - Campaign ID
   * @param {boolean} useCache - Use cached campaign if available (default: true)
   * @returns {Promise<void>}
   */
  const fetchCampaignById = async (id, useCache = true) => {
    // Check cache first if useCache is true
    if (useCache) {
      const cached = getCampaignById(id)
      if (cached) {
        currentCampaign.value = cached
        return
      }
    }
    
    loading.value = true
    error.value = null
    notFound.value = false
    
    try {
      const response = await campaignService.getCampaignById(id)
      
      // The response structure: { data: {...} }
      const campaign = response.data || response
      
      if (campaign) {
        currentCampaign.value = campaign
        
        // Update in campaigns list if it exists there
        const index = campaigns.value.findIndex(c => c.id === String(id))
        if (index !== -1) {
          campaigns.value[index] = campaign
        }
      } else {
        notFound.value = true
      }
      
      error.value = null
    } catch (err) {
      if (err?.error?.code === ERROR_CODES.NOT_FOUND || err?.status === HTTP_STATUS.NOT_FOUND) {
        notFound.value = true
        error.value = null
      } else {
        error.value = err?.error?.message || 'Failed to load campaign. Please try again.'
        notFound.value = false
      }
      console.error('Error fetching campaign:', err)
      currentCampaign.value = null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create a new campaign
   * @param {object} data - Campaign data
   * @returns {Promise<object>} Created campaign
   */
  const createCampaign = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await campaignService.createCampaign(data)
      
      // The response structure: { data: {...} }
      const newCampaign = response.data || response
      
      // Add to campaigns list
      if (newCampaign) {
        campaigns.value.unshift(newCampaign)
      }
      
      error.value = null
      return newCampaign
    } catch (err) {
      error.value = err?.error?.message || 'Failed to create campaign. Please try again.'
      console.error('Error creating campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update an existing campaign
   * @param {string|number} id - Campaign ID
   * @param {object} data - Updated campaign data
   * @returns {Promise<object>} Updated campaign
   */
  const updateCampaign = async (id, data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await campaignService.updateCampaign(id, data)
      
      // The response structure: { data: {...} }
      const updatedCampaign = response.data || response
      
      // Update in campaigns list
      const index = campaigns.value.findIndex(c => c.id === String(id))
      if (index !== -1) {
        campaigns.value[index] = updatedCampaign
      }
      
      // Update current campaign if it's the one being updated
      if (currentCampaign.value && currentCampaign.value.id === String(id)) {
        currentCampaign.value = updatedCampaign
      }
      
      error.value = null
      return updatedCampaign
    } catch (err) {
      error.value = err?.error?.message || 'Failed to update campaign. Please try again.'
      console.error('Error updating campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete a campaign
   * @param {string|number} id - Campaign ID
   * @returns {Promise<void>}
   */
  const deleteCampaign = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await campaignService.deleteCampaign(id)
      
      // Remove from campaigns list
      const index = campaigns.value.findIndex(c => c.id === String(id))
      if (index !== -1) {
        campaigns.value.splice(index, 1)
      }
      
      // Clear current campaign if it's the one being deleted
      if (currentCampaign.value && currentCampaign.value.id === String(id)) {
        currentCampaign.value = null
      }
      
      error.value = null
    } catch (err) {
      error.value = err?.error?.message || 'Failed to delete campaign. Please try again.'
      console.error('Error deleting campaign:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Set search query
   * @param {string} query - Search query
   */
  const setSearchQuery = (query) => {
    searchQuery.value = query || ''
  }
  
  /**
   * Set filter
   * @param {string} key - Filter key
   * @param {any} value - Filter value
   */
  const setFilter = (key, value) => {
    filters.value[key] = value
  }
  
  /**
   * Set multiple filters
   * @param {object} newFilters - Filters object
   */
  const setFilters = (newFilters) => {
    filters.value = {
      ...filters.value,
      ...newFilters
    }
  }
  
  /**
   * Clear all filters
   */
  const clearFilters = () => {
    filters.value = {
      status: null,
      page: 1,
      limit: 10
    }
  }
  
  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
    notFound.value = false
  }
  
  /**
   * Clear current campaign
   */
  const clearCurrentCampaign = () => {
    currentCampaign.value = null
    notFound.value = false
  }
  
  /**
   * Reset store to initial state
   */
  const reset = () => {
    campaigns.value = []
    currentCampaign.value = null
    loading.value = false
    error.value = null
    notFound.value = false
    searchQuery.value = ''
    filters.value = {
      status: null,
      page: 1,
      limit: 10
    }
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    }
  }

  return {
    // State
    campaigns,
    currentCampaign,
    loading,
    error,
    notFound,
    searchQuery,
    filters,
    pagination,
    
    // Getters
    filteredCampaigns,
    getCampaignById,
    campaignCount,
    activeCampaigns,
    getCampaignsByStatus,
    hasCampaigns,
    
    // Actions
    fetchCampaigns,
    fetchCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    setSearchQuery,
    setFilter,
    setFilters,
    clearFilters,
    clearError,
    clearCurrentCampaign,
    reset
  }
})

export default useCampaignsStore
