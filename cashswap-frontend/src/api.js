import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,
  timeout: 10000 // 10 second timeout
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const userInfo = localStorage.getItem('cashswapUser');
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.token) {
          // Add JWT token to Authorization header
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized - redirecting to login');
          localStorage.removeItem('cashswapUser');
          window.location.href = '/';
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
          // Server error
          console.error('Server error occurred');
          break;

        default:
          console.error(`Error ${status}:`, data?.message || 'Unknown error');
      }

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Response Error:', {
          url: error.config.url,
          status,
          message: data?.message || error.message
        });
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error - no response from server');
      
      // You could show a toast notification here
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Network Error:', error.message);
      }
    } else {
      // Something else went wrong
      console.error('Request setup error:', error.message);
    }

    // Always reject the promise so components can handle errors
    return Promise.reject(error);
  }
);

export default api;
