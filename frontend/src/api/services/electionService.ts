import CandidateCard from '@/components/election/CandidateCard';
import apiClient from '../config';
import { Vote } from 'lucide-react';

export interface ElectionRequest {
  id?: number,
  title: string;
  description: string;
  rules: string[];
  startDate: Date;
  endDate: Date;
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
  imageURL?: string;
  organization?: string;
  type: 'public' | 'private' | 'invite-only';
  kyc_required?: boolean;
  age_restriction?: [number, number];
  regions?: string[];
  invitedEmails?: string[];
  accessControl? : 'csv' | 'manual' | 'invite' | 'public';
  ownerAddress: string;
  ownerUserId?: string;
}

export interface CandidateRequest {
  id: string;
  name: string;
  party: string;
  position: string;
  bio: string;
  photo?: string;
  twitter?: string;
  website?: string;
}

const electionService = {
  
  createElection: async (electionData: ElectionRequest) => {
    try {
      //TODO: fix the date format here please
      //convert time to milliseconds

      const response = await apiClient.post('/admin/election', electionData);
      return response.data;
    } catch (error) {

      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create election');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'Error setting up request');
      }
    }
  },

  deleteElection: async (id: number) => {
    const response = await apiClient.delete(`/admin/election/${id}`);
  },

  getElections: async () => {
    const response = await apiClient.get('/admin/elections');
    return response.data;
  },

  getElectionByState: async (state: string) => {
    const response = await apiClient.get(`/admin/elections/${state}`);
  },

  createCandidates: async (electionId: number, candidates: CandidateRequest[]) => {
    const response = await apiClient.post(`/admin/candidate/${electionId}`, { candidates });
    return response.data;
  },

  getCandidates: async (electionId: number) => {
    const response = await apiClient.get(`/admin/candidates/${electionId}`);
    return response.data;
  },


  getElection: async (id: number) => {
    const response = await apiClient.get(`/admin/election/${id}`);
    return response.data;
  },

  vote: async (electionId: number, candidateId: number) => {
    const response = await apiClient.put(`/admin/election/vote/${electionId}`, { candidateId });
    return response.data;
  },

  isEligible: async (electionId: number): Promise<{ isEligible: boolean }> => {
    const response = await apiClient.get(`/admin/election/is-eligible/${electionId}`);
    return response.data;
  },

  // updateElection: async (id: number, updates: Partial<ElectionRequest>) => {
  //   const response = await apiClient.patch<ElectionResponse>(`/admin/election/${id}`, updates);
  //   return response.data;
  // },
};

export default electionService;