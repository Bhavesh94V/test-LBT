// API Service Layer - Production Ready with Full Interceptor Support
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const config: ApiConfig = {
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    this.api = axios.create(config);

    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      (config) => {
        // Use admin token for admin routes, user token for others
        const url = config.url || '';
        const isAdminRoute = url.startsWith('/admin');
        const token = isAdminRoute
          ? (localStorage.getItem('adminToken') || localStorage.getItem('authToken'))
          : (localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling errors and token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Return the full response for consistency
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(
                `${API_BASE_URL}/auth/refresh-token`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`,
                  },
                }
              );

              const newAccessToken = response.data.data.token;
              localStorage.setItem('authToken', newAccessToken);
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.api(originalRequest);
            } else {
              // No refresh token, redirect to login
              localStorage.removeItem('authToken');
              sessionStorage.removeItem('authToken');
              window.location.href = '/login';
            }
          } catch (refreshError) {
            console.error('[API] Token Refresh Error:', refreshError);
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            window.location.href = '/login';
          }
        }

        // Handle other errors
        if (error.response?.status === 403) {
          console.error('[API] Access Denied:', error.response.data);
        }

        if (error.response?.status >= 500) {
          console.error('[API] Server Error:', error.response.data);
        }

        return Promise.reject(error.response?.data || error);
      }
    );
  }

  // Expose raw axios instance for direct use
  getInstance(): AxiosInstance {
    return this.api;
  }

  // AUTH ENDPOINTS
  signup = (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) =>
    this.api.post<any, ApiResponse>('/auth/signup', data);

  sendOtp = (phone: string) =>
    this.api.post<any, ApiResponse>('/auth/send-otp', { phone });

  verifyOtp = (phone: string, otp: string) =>
    this.api.post<any, ApiResponse>('/auth/verify-otp', { phone, otp });

  login = (data: { email?: string; phone?: string; password: string }) =>
    this.api.post<any, ApiResponse>('/auth/login', data);

  adminLogin = (email: string, password: string) =>
    this.api.post<any, ApiResponse>('/admin/login', { email, password });

  logout = () =>
    this.api.post<any, ApiResponse>('/auth/logout');

  forgotPassword = (phone: string) =>
    this.api.post<any, ApiResponse>('/auth/forgot-password', { phone });

  resetPassword = (phone: string, otp: string, newPassword: string) =>
    this.api.post<any, ApiResponse>('/auth/reset-password', { phone, otp, newPassword });

  // PROPERTY ENDPOINTS
  getProperties = (filters?: any) =>
    this.api.get<any, ApiResponse>('/properties', { params: filters });

  getPropertyDetail = (id: string) =>
    this.api.get<any, ApiResponse>(`/properties/${id}`);

  createProperty = (data: FormData) =>
    this.api.post<any, ApiResponse>('/properties', data);

  updateProperty = (id: string, data: FormData) =>
    this.api.put<any, ApiResponse>(`/properties/${id}`, data);

  deleteProperty = (id: string) =>
    this.api.delete<any, ApiResponse>(`/properties/${id}`);

  uploadPropertyGallery = (propertyId: string, files: FormData) =>
    this.api.post<any, ApiResponse>(`/properties/${propertyId}/gallery`, files);

  // USER ENDPOINTS
  getUserProfile = () =>
    this.api.get<any, ApiResponse>('/users/profile');

  updateUserProfile = (data: any) =>
    this.api.put<any, ApiResponse>('/users/profile', data);

  changePassword = (currentPassword: string, newPassword: string) =>
    this.api.put<any, ApiResponse>('/users/change-password', { currentPassword, newPassword });

  getUserDashboard = () =>
    this.api.get<any, ApiResponse>('/users/dashboard');

  getUserGroups = () =>
    this.api.get<any, ApiResponse>('/users/groups');

  getUserPayments = () =>
    this.api.get<any, ApiResponse>('/users/payments');

  getUserShortlisted = () =>
    this.api.get<any, ApiResponse>('/users/shortlisted');

  addToShortlist = (propertyId: string) =>
    this.api.post<any, ApiResponse>(`/users/shortlist/${propertyId}`);

  removeFromShortlist = (propertyId: string) =>
    this.api.delete<any, ApiResponse>(`/users/shortlist/${propertyId}`);

  deleteAccount = () =>
    this.api.delete<any, ApiResponse>('/users/account');

  // GROUP ENDPOINTS
  getGroups = (filters?: any) =>
    this.api.get<any, ApiResponse>('/groups', { params: filters });

  getGroupDetail = (id: string) =>
    this.api.get<any, ApiResponse>(`/groups/${id}`);

  createGroup = (data: any) =>
    this.api.post<any, ApiResponse>('/groups', data);

  updateGroup = (id: string, data: any) =>
    this.api.put<any, ApiResponse>(`/groups/${id}`, data);

  lockGroup = (id: string) =>
    this.api.put<any, ApiResponse>(`/groups/${id}/lock`, {});

  deleteGroup = (id: string) =>
    this.api.delete<any, ApiResponse>(`/groups/${id}`);

  joinGroup = (id: string) =>
    this.api.post<any, ApiResponse>(`/groups/${id}/join`, {});

  getGroupMembers = (id: string) =>
    this.api.get<any, ApiResponse>(`/groups/${id}/members`);

  // INQUIRY ENDPOINTS
  submitInquiry = (data: any) =>
    this.api.post<any, ApiResponse>('/inquiries', data);

  getInquiries = (filters?: any) =>
    this.api.get<any, ApiResponse>('/inquiries', { params: filters });

  getInquiryDetail = (id: string) =>
    this.api.get<any, ApiResponse>(`/inquiries/${id}`);

  updateInquiry = (id: string, data: any) =>
    this.api.put<any, ApiResponse>(`/inquiries/${id}`, data);

  replyToInquiry = (id: string, data: any) =>
    this.api.post<any, ApiResponse>(`/inquiries/${id}/reply`, data);

  deleteInquiry = (id: string) =>
    this.api.delete<any, ApiResponse>(`/inquiries/${id}`);

  // PAYMENT ENDPOINTS
  getPayments = (filters?: any) =>
    this.api.get<any, ApiResponse>('/payments', { params: filters });

  getPaymentDetail = (id: string) =>
    this.api.get<any, ApiResponse>(`/payments/${id}`);

  createPayment = (data: any) =>
    this.api.post<any, ApiResponse>('/payments', data);

  sendPaymentLink = (id: string, data: any) =>
    this.api.post<any, ApiResponse>(`/payments/${id}/send-link`, data);

  verifyPayment = (id: string, data: any) =>
    this.api.post<any, ApiResponse>(`/payments/${id}/verify`, data);

  refundPayment = (id: string, data: any) =>
    this.api.post<any, ApiResponse>(`/payments/${id}/refund`, data);

  getUserPaymentHistory = (userId: string) =>
    this.api.get<any, ApiResponse>(`/payments/user/${userId}`);

  // NOTIFICATION ENDPOINTS
  getNotifications = (filters?: any) =>
    this.api.get<any, ApiResponse>('/notifications', { params: filters });

  markNotificationAsRead = (id: string) =>
    this.api.put<any, ApiResponse>(`/notifications/${id}/read`, {});

  deleteNotification = (id: string) =>
    this.api.delete<any, ApiResponse>(`/notifications/${id}`);

  sendNotification = (data: any) =>
    this.api.post<any, ApiResponse>('/notifications', data);

  // ADMIN ENDPOINTS
  getAdmins = (filters?: any) =>
    this.api.get<any, ApiResponse>('/admins', { params: filters });

  createAdmin = (data: any) =>
    this.api.post<any, ApiResponse>('/admins', data);

  updateAdmin = (id: string, data: any) =>
    this.api.put<any, ApiResponse>(`/admins/${id}`, data);

  deleteAdmin = (id: string) =>
    this.api.delete<any, ApiResponse>(`/admins/${id}`);

  resetAdminPassword = (id: string) =>
    this.api.post<any, ApiResponse>(`/admins/${id}/reset-password`, {});

  // ANALYTICS ENDPOINTS
  getAnalyticsDashboard = () =>
    this.api.get<any, ApiResponse>('/analytics/dashboard');

  getGoogleAnalytics = (filters?: any) =>
    this.api.get<any, ApiResponse>('/analytics/google-analytics', { params: filters });

  getRevenueAnalytics = (filters?: any) =>
    this.api.get<any, ApiResponse>('/analytics/revenue', { params: filters });

  getPropertyAnalytics = () =>
    this.api.get<any, ApiResponse>('/analytics/properties');

  exportAnalytics = (type: string, format: string) =>
    this.api.get<any, ApiResponse>('/analytics/export', { params: { type, format }, responseType: 'blob' });

  // SETTINGS ENDPOINTS
  getSettings = () =>
    this.api.get<any, ApiResponse>('/settings');

  updateSettings = (data: any) =>
    this.api.put<any, ApiResponse>('/settings', data);
}

const apiService = new ApiService();

// Export the raw axios instance for direct use in service modules
export const apiClient = apiService.getInstance();

// Export the service for backward compatibility
export default apiService;
