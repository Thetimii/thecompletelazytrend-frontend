// API configuration for both development and production environments

// Determine if we're in production
const isProd = import.meta.env.PROD;

// Get the backend URL from environment variables or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://thecompletelazytrend-backend.onrender.com';

// In development, use relative paths which will be handled by the Vite dev server proxy
// In production, use the full backend URL
export const API_BASE_URL = isProd ? BACKEND_URL : '';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Make sure endpoint starts with /api
  const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  return `${API_BASE_URL}${apiEndpoint}`;
};

console.log('API Base URL:', API_BASE_URL);
