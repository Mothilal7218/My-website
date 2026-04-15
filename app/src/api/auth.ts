// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
}

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  getMe: () => fetchAPI('/auth/me'),
};

// Admin API
export const adminAPI = {
  getStats: () => fetchAPI('/admin/stats'),
};

// Public API
export const publicAPI = {
  getBooks: () => fetchAPI('/books'),
  getReviews: () => fetchAPI('/reviews'),
  subscribe: (email: string) =>
    fetchAPI('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  trackVisit: (page: string) =>
    fetchAPI('/track/visit', {
      method: 'POST',
      body: JSON.stringify({ page }),
    }),
};
