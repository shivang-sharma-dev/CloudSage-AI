import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 min for AI analysis
});

// Request interceptor — attach auth token if present
client.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('cloudsage_api_key');
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    const normalizedError = {
      ...error,
      userMessage: message,
      statusCode: error.response?.status,
    };

    return Promise.reject(normalizedError);
  }
);

// ─── API Methods ───────────────────────────────────────────────────
export const api = {
  // Analysis
  analyze: (payload) => client.post('/api/v1/analyze', payload),
  getAnalysis: (id) => client.get(`/api/v1/analyze/${id}`),
  sendChatMessage: (sessionId, message) =>
    client.post(`/api/v1/analyze/${sessionId}/chat`, { message }),

  // Sessions
  getSessions: (params = {}) => client.get('/api/v1/sessions', { params }),
  getSession: (id) => client.get(`/api/v1/sessions/${id}`),
  deleteSession: (id) => client.delete(`/api/v1/sessions/${id}`),

  // Health
  health: () => client.get('/health'),
  info: () => client.get('/api/v1/info'),
};

export default client;
