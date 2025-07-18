import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Dataset statistics
  getDatasetStats: async () => {
    const response = await api.get('/api/dataset/stats');
    return response.data;
  },

  // Patients data
  getPatients: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    const response = await api.get(`/api/patients?${params.toString()}`);
    return response.data;
  },

  // Visualization data
  getBloodPressureDistribution: async () => {
    const response = await api.get('/api/visualizations/blood-pressure-distribution');
    return response.data;
  },

  getBloodPressureBoxplot: async () => {
    const response = await api.get('/api/visualizations/blood-pressure-boxplot');
    return response.data;
  },

  getAgeHistogram: async () => {
    const response = await api.get('/api/visualizations/age-histogram');
    return response.data;
  },

  getViolinPlot: async () => {
    const response = await api.get('/api/visualizations/violin-plot');
    return response.data;
  },

  // Import data
  importData: async () => {
    const response = await api.post('/api/import-data');
    return response.data;
  },

  // Model prediction
  predictCHD: async (inputData) => {
    const response = await api.post('/api/predict', inputData);
    return response.data;
  },

  // Model information
  getModelInfo: async () => {
    const response = await api.get('/api/model/info');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/');
    return response.data;
  }
};

export default api;