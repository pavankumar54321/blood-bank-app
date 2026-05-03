import axios from 'axios';

// Change from 8080 to 8082
const API_BASE_URL = 'http://localhost:8082/api/donors';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const donorService = {
  register: async (donorData) => {
    try {
      const response = await api.post('/register', donorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (loginData) => {
    try {
      const response = await api.post('/login', loginData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  search: async (searchData) => {
    try {
      const response = await api.post('/search', searchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },

  getAllDonors: async () => {
    try {
      const response = await api.get('/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch donors' };
    }
  },

  deleteDonor: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete donor' };
    }
  }
};