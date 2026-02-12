import { apiClient } from './api';
import type { BuyingGroup, InterestStatus, Property, ApiResponse } from '@/types/index';

// PUBLIC PROPERTIES API
export const propertyApi = {
  // GET all properties (public, with pagination and filters)
  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<{ properties: Property[]; pagination?: any }>>('/properties', { params });
    return response.data;
  },
  
  // GET single property details by ID
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data;
  },
  
  // GET properties by filters (city, status, etc.)
  search: async (filters: any) => {
    const response = await apiClient.get<ApiResponse<{ properties: Property[]; pagination?: any }>>('/properties', { params: filters });
    return response.data;
  },
};

// PUBLIC GROUPS API
export const groupApi = {
  // GET all groups (public)
  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<{ groups: BuyingGroup[]; pagination?: any }>>('/groups', { params });
    return response.data;
  },
  
  // GET groups for a specific property
  getByPropertyId: async (propertyId: string, params?: any) => {
    const response = await apiClient.get<ApiResponse<{ groups: BuyingGroup[]; pagination?: any }>>(
      `/properties/${propertyId}/groups`,
      { params }
    );
    return response.data;
  },
  
  // JOIN a group (user token required)
  join: async (groupId: string) => {
    const response = await apiClient.post(`/groups/${groupId}/join`, {});
    return response.data;
  },
  
  // LEAVE a group (user token required)
  leave: async (groupId: string) => {
    const response = await apiClient.post(`/groups/${groupId}/leave`, {});
    return response.data;
  },
};

// PUBLIC INQUIRIES/CONTACTS API
export const publicInquiryApi = {
  // CREATE general contact inquiry (public - no property specified)
  createContact: async (data: {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const response = await apiClient.post<ApiResponse<InterestStatus>>('/inquiries', data);
    return response.data;
  },

  // CREATE property-specific inquiry (with propertyId)
  create: async (data: {
    propertyId: string;
    fullName: string;
    email: string;
    phone: string;
    configurationInterested?: string;
    budgetRange?: string | { min: number; max: number };
    timeline?: string;
    comments?: string;
  }) => {
    // Clean undefined values before sending
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
    );
    const response = await apiClient.post<ApiResponse<InterestStatus>>('/inquiries', cleanData);
    return response.data;
  },
  
  // QUICK interest express (minimal data)
  expressInterest: async (data: {
    phone: string;
    propertyId: string;
  }) => {
    const response = await apiClient.post('/inquiries/express', data);
    return response.data;
  },
};

// USER SHORTLIST/FAVORITES API
export const userFavoritesApi = {
  // ADD property to shortlist
  add: async (propertyId: string) => {
    const response = await apiClient.post(`/users/favorites/${propertyId}`, {});
    return response.data;
  },
  
  // REMOVE property from shortlist
  remove: async (propertyId: string) => {
    const response = await apiClient.delete(`/users/favorites/${propertyId}`);
    return response.data;
  },
  
  // GET user's favorites
  getAll: async (params?: any) => {
    const response = await apiClient.get('/users/favorites', { params });
    return response.data;
  },
  
  // CHECK if property is in favorites
  isFavorite: async (propertyId: string) => {
    const response = await apiClient.get(`/users/favorites/${propertyId}/check`);
    return response.data;
  },
};

// USER AUTHENTICATION API
export const userAuthApi = {
  // REGISTER user
  register: async (data: {
    phone: string;
    fullName: string;
    email?: string;
    preferredCity?: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  
  // SEND OTP
  sendOtp: async (phone: string) => {
    const response = await apiClient.post('/auth/send-otp', { phone });
    return response.data;
  },
  
  // VERIFY OTP & LOGIN
  verifyOtp: async (data: {
    phone: string;
    otp: string;
  }) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },
  
  // LOGOUT
  logout: async () => {
    const response = await apiClient.post('/auth/logout', {});
    return response.data;
  },
};

// USER PROFILE API
export const userProfileApi = {
  // GET current user profile
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
  
  // UPDATE user profile
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },
  
  // GET user's groups
  getGroups: async (params?: any) => {
    const response = await apiClient.get('/users/me/groups', { params });
    return response.data;
  },
};
