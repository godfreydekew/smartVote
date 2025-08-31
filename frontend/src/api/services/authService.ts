
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

export interface passwordResetRequest {
  email: string;
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
    const response = await apiClient.post('user/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   * Endpoint: POST /logout
   */
  logout: async () => {
    const response = await apiClient.post('user/logout');
    return response.data;
  },

  /**
   * Check if user session is valid
   * Endpoint: GET /check-session
   */
  checkSession: async () => {
    const response = await apiClient.get('user/check-session');
    return response.data;
  },

  /**
   * Send password reset request
   * Endpoint: POST /request-password-reset
   *
   * @param email - The email address of the user requesting a password reset
   */
  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('user/request-password-reset', { email });
    return response.data;
  },

  /**
   * Apply for admin role
   * Endpoint: POST /apply-admin
   * Requires authentication
   */
  postApplyAdmin: async () => {
    const response = await apiClient.post('user/apply-admin');
    return response.data;
  },

  /**
   * Reset password
   * Endpoint: POST /reset-password
   *
   * @param token - The password reset token
   * @param password - The new password
   */
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('user/reset-password', { token, newPassword: password });
    return response.data;
  },
};

export default authService;
