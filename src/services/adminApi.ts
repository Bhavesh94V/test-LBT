import { apiClient } from './api';
import type { 
  InterestStatus, 
  Payment, 
  User, 
  BuyingGroup, 
  AdminSettings,
  Notification,
  SuspendUserRequest,
  SendNotificationRequest,
  VerifyPaymentRequest,
  SendPaymentLinkRequest,
  CreateGroupRequest
} from '@/types/index';

// INQUIRIES (CONTACTS) - Admin Management
export const inquiryApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/inquiries', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/inquiries/${id}`);
    return response.data;
  },
  
  verifyInquiry: async (id: string, data: { notes?: string }) => {
    const response = await apiClient.put(`/admin/inquiries/${id}/verify`, data);
    return response.data;
  },
  
  rejectInquiry: async (id: string, data: { reason: string }) => {
    const response = await apiClient.put(`/admin/inquiries/${id}/reject`, data);
    return response.data;
  },
  
  sendPaymentLink: async (id: string, data: SendPaymentLinkRequest) => {
    const response = await apiClient.post(`/admin/inquiries/${id}/send-payment-link`, data);
    return response.data;
  },
  
  deleteInquiry: async (id: string) => {
    const response = await apiClient.delete(`/admin/inquiries/${id}`);
    return response.data;
  },
};

// PAYMENTS - Admin Management
export const paymentApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/payments', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/payments/${id}`);
    return response.data;
  },
  
  verifyPayment: async (id: string, data: VerifyPaymentRequest) => {
    const response = await apiClient.post(`/admin/payments/${id}/verify`, data);
    return response.data;
  },
  
  getRevenue: async (filters?: any) => {
    const response = await apiClient.get('/admin/payments/revenue', { params: filters });
    return response.data;
  },
  
  exportPayments: async (format: string) => {
    const response = await apiClient.get('/admin/payments/export', { 
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },
};

// USERS - Admin Management
export const userApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/users', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
  },
  
  suspendUser: async (id: string, data: SuspendUserRequest) => {
    const response = await apiClient.post(`/admin/users/${id}/suspend`, data);
    return response.data;
  },
  
  activateUser: async (id: string) => {
    const response = await apiClient.post(`/admin/users/${id}/activate`, {});
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  sendEmail: async (id: string, data: { subject: string; message: string }) => {
    const response = await apiClient.post(`/admin/users/${id}/send-email`, data);
    return response.data;
  },
};

// GROUPS - Admin Management
export const groupApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/groups', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/groups/${id}`);
    return response.data;
  },
  
  create: async (data: CreateGroupRequest) => {
    const response = await apiClient.post('/admin/groups', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<BuyingGroup>) => {
    const response = await apiClient.put(`/admin/groups/${id}`, data);
    return response.data;
  },
  
  lockGroup: async (id: string) => {
    const response = await apiClient.post(`/admin/groups/${id}/lock`, {});
    return response.data;
  },
  
  unlockGroup: async (id: string) => {
    const response = await apiClient.post(`/admin/groups/${id}/unlock`, {});
    return response.data;
  },
  
  deleteGroup: async (id: string) => {
    const response = await apiClient.delete(`/admin/groups/${id}`);
    return response.data;
  },
  
  getMembers: async (id: string) => {
    const response = await apiClient.get(`/admin/groups/${id}/members`);
    return response.data;
  },
  
  createWhatsappGroup: async (id: string, data: { name: string }) => {
    const response = await apiClient.post(`/admin/groups/${id}/create-whatsapp`, data);
    return response.data;
  },
};

// NOTIFICATIONS - Admin Management
export const notificationApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/notifications', { params: filters });
    return response.data;
  },
  
  send: async (data: SendNotificationRequest) => {
    const response = await apiClient.post('/admin/notifications/send', data);
    return response.data;
  },
  
  sendBulk: async (data: { userIds: string[]; title: string; message: string }) => {
    const response = await apiClient.post('/admin/notifications/send-bulk', data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/notifications/${id}`);
    return response.data;
  },
};

// SETTINGS - Admin Management
export const settingsApi = {
  get: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },
  
  update: async (data: Partial<AdminSettings>) => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data;
  },
  
  testEmail: async (email: string) => {
    const response = await apiClient.post('/admin/settings/test-email', { email });
    return response.data;
  },
  
  testSms: async (phone: string) => {
    const response = await apiClient.post('/admin/settings/test-sms', { phone });
    return response.data;
  },
};

// ADMIN USERS - Super Admin Only
export const adminUserApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/admin-users', { params: filters });
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/admin/admin-users', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put(`/admin/admin-users/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/admin-users/${id}`);
    return response.data;
  },
  
  resetPassword: async (id: string) => {
    const response = await apiClient.post(`/admin/admin-users/${id}/reset-password`, {});
    return response.data;
  },
};

// ANALYTICS - Admin Dashboard
export const analyticsApi = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/analytics/dashboard');
    return response.data;
  },
  
  getRevenue: async (filters?: any) => {
    const response = await apiClient.get('/admin/analytics/revenue', { params: filters });
    return response.data;
  },
  
  getUsers: async (filters?: any) => {
    const response = await apiClient.get('/admin/analytics/users', { params: filters });
    return response.data;
  },
  
  getProperties: async (filters?: any) => {
    const response = await apiClient.get('/admin/analytics/properties', { params: filters });
    return response.data;
  },
  
  getGroups: async (filters?: any) => {
    const response = await apiClient.get('/admin/analytics/groups', { params: filters });
    return response.data;
  },
};

// PROPERTIES - Admin Management (CRUD)
export const propertyApi = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/admin/properties', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/properties/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/admin/properties', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/properties/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/properties/${id}`);
    return response.data;
  },

  uploadGallery: async (id: string, files: FormData) => {
    const response = await apiClient.post(`/admin/properties/${id}/gallery`, files, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

// ADMIN AUTH
export const adminAuthApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/admin/login', { email, password });
    return response.data;
  },
};

export default {
  auth: adminAuthApi,
  inquiries: inquiryApi,
  payments: paymentApi,
  users: userApi,
  groups: groupApi,
  notifications: notificationApi,
  settings: settingsApi,
  adminUsers: adminUserApi,
  analytics: analyticsApi,
  properties: propertyApi,
};
