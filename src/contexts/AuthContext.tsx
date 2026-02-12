'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { apiClient } from '@/services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'super_admin';
  status: string;
  profilePicture?: string;
  preferredCity?: string;
  joinedDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;

  // Auth flows
  register: (data: { phone: string; fullName: string; email: string; preferredCity?: string }) => Promise<any>;
  sendOtp: (phone: string) => Promise<any>;
  verifyOtp: (phone: string, otp: string) => Promise<any>;
  logout: () => void;

  // Profile management
  updateProfile: (data: any) => Promise<void>;
  fetchProfile: () => Promise<void>;

  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, if token exists fetch user profile
  useEffect(() => {
    if (token) {
      fetchProfile().catch(() => {
        // Token may be invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setUser(null);
      });
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      const userData = response?.data?.data?.user || response?.data?.data || response?.data?.user || response?.data;
      if (userData && (userData._id || userData.id)) {
        setUser(userData);
      }
    } catch (err: any) {
      console.error('[Auth] Failed to fetch profile:', err);
      throw err;
    }
  };

  const register = async (data: { phone: string; fullName: string; email: string; preferredCity?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      // Use /auth/register endpoint (not /auth/signup)
      const response = await apiClient.post('/auth/register', {
        phone: data.phone,
        fullName: data.fullName,
        email: data.email,
        preferredCity: data.preferredCity || undefined,
      });
      const resData = response?.data;
      return resData;
    } catch (err: any) {
      const errorMsg = err?.message || err?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.sendOtp(phone);
      const resData = response?.data;
      return resData;
    } catch (err: any) {
      const errorMsg = err?.message || err?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.verifyOtp(phone, otp);
      const resData = response?.data;
      const userData = resData?.data?.user || resData?.user;
      const accessToken = resData?.data?.token || resData?.token;
      const refreshTkn = resData?.data?.refreshToken || resData?.refreshToken;
      const isNewUser = resData?.data?.isNewUser || resData?.isNewUser;

      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
        if (refreshTkn) localStorage.setItem('refreshToken', refreshTkn);
        setToken(accessToken);
      }
      if (userData) {
        setUser(userData);
      }

      return { verified: true, isNewUser, user: userData, token: accessToken };
    } catch (err: any) {
      const errorMsg = err?.message || err?.data?.message || 'OTP verification failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.updateUserProfile(data);
      const updated = response?.data?.data?.user || response?.data?.user || response?.data?.data;
      if (updated && user) {
        setUser({ ...user, ...updated });
      }
    } catch (err: any) {
      setError(err?.message || 'Profile update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    token,
    error,
    register,
    sendOtp,
    verifyOtp,
    logout,
    updateProfile,
    fetchProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
