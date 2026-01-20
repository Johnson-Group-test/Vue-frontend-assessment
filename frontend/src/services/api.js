import axios from 'axios';
import { ERROR_CODES } from '@/constants';

// Base API configuration
// In development, Vite proxy will forward /api to http://localhost:3000
// In production, set VITE_API_BASE_URL environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': 'assessment-user'
  }
});

// Request interceptor (optional - for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional - for error handling)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      // Preserve the response data structure
      const errorData = error.response.data || {}
      return Promise.reject({
        ...errorData,
        status: error.response.status,
        error: {
          ...errorData.error,
          code: errorData.error?.code || (error.response.status === 404 ? ERROR_CODES.NOT_FOUND : 
                error.response.status === 401 ? ERROR_CODES.UNAUTHORIZED :
                error.response.status === 403 ? ERROR_CODES.FORBIDDEN :
                error.response.status === 422 ? ERROR_CODES.VALIDATION_ERROR :
                error.response.status >= 500 ? ERROR_CODES.SERVER_ERROR :
                ERROR_CODES.UNKNOWN_ERROR)
        }
      });
    } else if (error.request) {
      // Request made but no response received
      // Check for timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return Promise.reject({ 
          error: { 
            message: 'The request took too long to complete. Please try again.', 
            code: ERROR_CODES.TIMEOUT_ERROR 
          } 
        });
      }
      
      // Check for network/connection errors
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        return Promise.reject({ 
          error: { 
            message: 'Unable to connect to the server. Please check your internet connection and try again.', 
            code: ERROR_CODES.NETWORK_ERROR 
          } 
        });
      }
      
      // Generic connection error
      return Promise.reject({ 
        error: { 
          message: 'Connection failed. Please check your internet connection and try again.', 
          code: ERROR_CODES.CONNECTION_ERROR 
        } 
      });
    } else {
      // Something else happened (error in request setup)
      return Promise.reject({
        error: {
          message: error.message || 'An unexpected error occurred. Please try again.',
          code: ERROR_CODES.UNKNOWN_ERROR
        }
      });
    }
  }
);

export default api;

// Example: Campaign API service
// TODO: Create services/campaignService.js for campaign-specific API calls
// You can import this api instance there
