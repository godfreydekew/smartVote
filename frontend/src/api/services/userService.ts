
import apiClient from '../config';

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  // Add other fields that can be updated
}

const userService = {

  getUserByEmail: async (email: string) => {
    const response = await apiClient.get('/user/', { params: { email } });
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUserRequest) => {
    const response = await apiClient.put(`/user/${userId}`, userData);
    return response.data;
  },

  updateIdentityCommitment: async (userId: string, identitycommitment: string) => {
    const response = await apiClient.put(`/user/${userId}/identity-commitment`, { identitycommitment });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/user/`);
    return response.data;
  },

  hasVoted: async (electionId: string) => {
    const response = await apiClient.get(`/admin/election/has-voted/${electionId}`);
    return response.data;
  } 
};

export default userService;
