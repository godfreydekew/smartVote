import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api';
import { useActiveAccount } from 'thirdweb/react';
import { useProfiles } from 'thirdweb/react';
import { client } from '@/utils/thirdweb-client';
import { createSemaphoreIdentity, getIdentityCommitment } from '@/utils/semaphore';
import userService from '@/api/services/userService';
import { cp } from 'fs';

interface User {
  age: number;
  created_at: string;
  country_of_residence: string;
  full_name: string;
  kyc_verified: boolean;
  id: string;
  email: string;
  name: string;
  user_role: string;
  address?: string;
  identitycommitment?: string;
  kyc_session_id?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, address?: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  identitycommitment: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [identitycommitment, setIdentityCommitment] = useState<string | null>(null);
  const [kycRedirectShownInSession, setKycRedirectShownInSession] = useState(false);
  const account = useActiveAccount();
  const { data: profiles, isLoading: profilesLoading } = useProfiles({ client });

  // Load existing identity commitment on mount
  useEffect(() => {
    const existingCommitment = getIdentityCommitment();
    if (existingCommitment) {
      setIdentityCommitment(existingCommitment);
    }
  }, []);

  // Reset KYC session flag when thirdweb account changes
  useEffect(() => {
    setKycRedirectShownInSession(false);
  }, [account?.address]);

  // Check session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiClient.get(`user/check-session`, {
          withCredentials: true,
        });

        if (response.data && response.data.user) {

          // fallback in case account is ready early
          setUser({
            ...response.data.user,
            address: account?.address || null,
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // console.error('Session check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [account?.address]);

  // Sync account address to user when it becomes available
  useEffect(() => {
    if (account?.address) {
      setUser((prev: User | null) => {
        if (!prev) return null;
        return { ...prev, address: account.address };
      });
    }
  }, [account?.address]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post(`user/login`, { email, password });
      // console.log('Login response:', response.data.user);
      setUser(response.data.user);
      setIsAuthenticated(true);
      console.log('Login response:', response.data.user);

      if (!response.data.user.identitycommitment) {
        // Generate Semaphore identity for anonymous voting
        const commitment = createSemaphoreIdentity();
        setIdentityCommitment(commitment);
        
        // Update user with identity commitment
        try {
          await userService.updateIdentityCommitment(response.data.user.id, commitment);
          console.log('Identity commitment updated for user');
        } catch (updateError) {
          console.error('Failed to update identity commitment:', updateError);
        }
      } else {
        const existingCommitment = getIdentityCommitment();
        if (existingCommitment) {
          setIdentityCommitment(existingCommitment);
        } else {
          // If no stored identity but user has commitment in DB, create new one
          const commitment = createSemaphoreIdentity();
          setIdentityCommitment(commitment);
        }
      }
      
      if (response.data.user.kyc_verified === false && !kycRedirectShownInSession) {
        setKycRedirectShownInSession(true);
        navigate('/kyc');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    await apiClient.post(`user/logout`, {
      withCredentials: true,
    });
    setIsAuthenticated(false);
    setUser(null);
    setIdentityCommitment(null);
    // Note: Identity is kept in localStorage for persistence
    navigate('/');
  };

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user, identitycommitment }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
