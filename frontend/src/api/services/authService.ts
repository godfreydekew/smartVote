
import apiClient from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

const authService = {
  /**
   * Create a new user account
   * Endpoint: POST /create
   */
  createAccount: async (userData: any) => {
    const payload = {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
      age: userData.age,
      gender: userData.gender,
      countryOfResidence: userData.countryOfResidence,
    }
    const response = await apiClient.post('user/create', payload);
    return response.data;
  },

  /**
   * Login user
   * Endpoint: POST /login
   */
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   * Endpoint: POST /logout
   */
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  /**
   * Check if user session is valid
   * Endpoint: GET /check-session
   */
  checkSession: async () => {
    const response = await apiClient.get('/check-session');
    return response.data;
  },

  /**
   * Apply for admin role
   * Endpoint: POST /apply-admin
   * Requires authentication
   */
  postApplyAdmin: async () => {
    const response = await apiClient.post('/apply-admin');
    return response.data;
  },
};

export default authService;
