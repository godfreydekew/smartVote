import apiClient from '../config';

export interface SecurityLog {
  id: number;
  election_id: number;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  resolved?: boolean;
}

const securityService = {
  // Fetch all security logs
  getAuditLogs: async () => {
    try {
      const response = await apiClient.get('/security/audit-logs');
      return response.data.auditLogs ?? [];
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
      throw error;
    }
  },
  // Fetch all security breaches
  getBreaches: async (): Promise<SecurityLog[]> => {
    try {
      const response = await apiClient.get('/security/breaches');
      return response.data.securityBreaches ?? [];
    } catch (error) {
      console.error('Failed to fetch security breaches', error);
      throw error;
    }
  },

  // Mark a breach/log as resolved
  resolveBreach: async (id: number, resolutionStatus = true): Promise<SecurityLog> => {
    try {
      const response = await apiClient.patch(`/security/breaches/${id}`, { resolutionStatus });
      return response.data;
    } catch (error) {
      console.error('Failed to resolve security breach', error);
      throw error;
    }
  },
};

export default securityService;
