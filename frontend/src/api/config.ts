import axios from 'axios';

// Detect if we're accessing from another device using IP address
const isIpAccess = window.location.hostname !== 'localhost';

// Use the same hostname the browser is using, but port 3001 for backend
const API_BASE_URL = `http://${window.location.hostname}:3001/api`;
// const DEPLOYED_API_BASE_URL = 'http://13.61.180.232:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiClient;
