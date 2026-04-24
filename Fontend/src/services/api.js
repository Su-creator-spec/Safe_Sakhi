import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:5001/api' : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const contactsAPI = {
  getContacts: () => api.get('/contacts'),
  addContact: (contact) => api.post('/contacts', contact),
};

export const sosAPI = {
  triggerSOS: (location) => api.post('/sos', { location }),
  getLogs: () => api.get('/sos/logs'),
};

export default api;
