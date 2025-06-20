import axios from 'axios';

const API_URL = 'https://nutri-gen-3.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        dietPreference: userData.dietPreference,
        goal: userData.goal,
        activityLevel: userData.activityLevel,
        allergies: userData.allergies,
        email: userData.email,
        password: userData.password
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return { user };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data?.error || 'Registration failed';
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { user };
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error.response?.data?.error || 'Failed to fetch user';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;