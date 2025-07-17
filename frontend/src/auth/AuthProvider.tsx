import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api';
import { useActiveAccount } from 'thirdweb/react';
import { useProfiles } from 'thirdweb/react';
import { client } from '@/utils/thirdweb-client';
import { cp } from 'fs';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, address?: any) => Promise<void>;
  logout: () => Promise<void>;
  user: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const account = useActiveAccount();
  const { data: profiles, isLoading: profilesLoading } = useProfiles({ client });

  // Check session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiClient.get(`user/check-session`, {
          withCredentials: true,
        });

        const isVerified = response.data.user?.kyc_session_id !== null;

        // fallback in case account is ready early
        setUser({
          ...response.data.user,
          address: account?.address || null,
        });

        setIsAuthenticated(isVerified);
      } catch (error) {
        // console.error('Session check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Sync account address to user when it becomes available
  useEffect(() => {
    if (account?.address) {
      setUser((prev: any) => ({
        ...prev,
        address: account.address,
      }));
    }
  }, [account?.address]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post(`user/login`, { email, password });
      // cnsole.log('Login response:', response.data.user);
      setUser(response.data.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
      // if (response.data.kycUrl && !response.data.user.kyc_session_id) {
      //   // Redirect to KYC flow
      //   window.location.href = response.data.kycUrl;
      //   // setIsAuthenticated(true);
      // } else {
      //   setUser(response.data.user);
      //   setIsAuthenticated(true);
      //   navigate('/dashboard');
      // }
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
    navigate('/');
  };

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
