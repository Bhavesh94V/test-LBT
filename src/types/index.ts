// API Response Types
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

// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'deleted';
  profilePicture?: string;
  joinedDate: string;
  suspendedReason?: string;
  notificationPreferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
}

// Property Types
export interface PropertyGalleryImage {
  _id?: string;
  url: string;
  caption?: string;
  uploadedAt?: Date;
}

export interface Property {
  _id?: string;
  id: string;
  name: string;
  developer: string;
  location: string;
  configurations: string[];
  priceRange: string;
  estimatedSavings: string;
  buyersJoined: number;
  totalPositions: number;
  joinBefore: string;
  status: 'under-construction' | 'newly-launched' | 'ready-to-move';
  image: string;
  amenities: string[];
  gallery?: PropertyGalleryImage[];
  totalGroups?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Inquiry/Interest Types - UPDATED FOR PAYMENT FLOW
export interface InterestStatus {
  _id?: string;
  propertyId: string;
  property?: Property;
  userId?: string;
  user?: User;
  userName: string;
  email: string;
  phone: string;
  city: string;
  occupation?: string;
  configuration: string;
  budgetRange: string;
  message?: string;
  
  // Status workflow: pending -> verified -> payment_link_sent -> paid -> grouped
  status: 'pending' | 'verified' | 'rejected' | 'payment_link_sent' | 'paid' | 'grouped';
  
  // Admin verification
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  
  // Payment tracking
  paymentLink?: string;
  paymentMethod?: 'razorpay' | 'bank_transfer' | 'upi' | 'manual';
  transactionId?: string;
  paymentVerifiedAt?: string;
  
  // Group assignment
  groupId?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Buying Group Types - UPDATED FOR MANAGEMENT
export interface GroupMember {
  userId: string;
  userName: string;
  email: string;
  phone: string;
  configuration: string;
  joinedAt: Date;
  paymentStatus: 'pending' | 'verified';
}

export interface BuyingGroup {
  _id?: string;
  propertyId: string;
  property?: Property;
  groupName: string;
  groupNumber: number;
  totalSlots: number;
  membersJoined: number;
  availableSlots: number;
  status: 'open' | 'full' | 'completed';
  locked: boolean;
  
  // Join deadline
  joinDeadline: string;
  deadlineExceeded: boolean;
  
  // Group configuration
  slotPrice?: number;
  configuration?: string;
  
  // WhatsApp integration
  whatsappLink?: string;
  whatsappGroupId?: string;
  whatsappGroupName?: string;
  
  // Members
  members: GroupMember[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Payment Types - UPDATED FOR PAYMENT TRACKING
export interface Payment {
  _id?: string;
  inquiryId: string;
  userId: string;
  groupId?: string;
  propertyId: string;
  property?: Property;
  amount: string;
  configuration: string;
  
  // Payment status: pending -> link_sent -> verified -> completed
  status: 'pending' | 'link_sent' | 'verified' | 'failed' | 'completed';
  
  paymentMethod: 'razorpay' | 'bank_transfer' | 'upi' | 'manual';
  paymentLink?: string;
  externalLink?: string;
  transactionId?: string;
  
  // Expiration
  expiresAt?: Date;
  
  // Verification
  verifiedAt?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
  
  // Failure tracking
  failureReason?: string;
  failedAt?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Notification Types
export interface Notification {
  _id?: string;
  recipientId: string;
  type: 'inquiry_received' | 'inquiry_verified' | 'payment_link_sent' | 'payment_received' | 'group_joined' | 'group_locked' | 'property_update' | 'user_suspended';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt?: string;
}

// Admin Settings Types - UPDATED
export interface BankDetails {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  ifscCode: string;
}

export interface AdminSettings {
  _id?: string;
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  
  // General settings
  autoApproveInterests: boolean;
  defaultGroupSlotSize: number;
  defaultJoinDeadlineDays: number;
  
  // Payment settings
  defaultPaymentMethod: 'razorpay' | 'bank_transfer' | 'upi';
  razorpayEnabled: boolean;
  razorpayKeyId?: string;
  razorpaySecretKey?: string;
  
  // Bank details
  bankDetails?: BankDetails;
  upiId?: string;
  
  // WhatsApp settings
  whatsappBusinessNumber?: string;
  whatsappApiKey?: string;
  
  // Email settings
  mailgunApiKey?: string;
  mailgunDomain?: string;
  
  // Admin notifications
  adminEmails: string[];
  adminPhones: string[];
  
  // Commission
  commissionPercentage: number;
  
  updatedAt?: Date;
}

// Form Request Types - UPDATED
export interface RegisterInterestRequest {
  propertyId: string;
  userName: string;
  email: string;
  phone: string;
  city?: string;
  occupation?: string;
  configuration: string;
  budgetRange: string;
  message?: string;
}

export interface SendPaymentLinkRequest {
  inquiryId: string;
  paymentMethod: 'razorpay' | 'bank_transfer' | 'upi' | 'manual';
  paymentLink?: string;
  externalLink?: string;
  amount: string;
  expiryDays?: number;
  notes?: string;
}

export interface CreateGroupRequest {
  propertyId: string;
  totalSlots: number;
  groupNumber: number;
  joinDeadlineDays: number;
  slotPrice?: number;
  whatsappLink?: string;
}

export interface VerifyPaymentRequest {
  paymentId: string;
  transactionId: string;
  verificationNotes?: string;
}

export interface SuspendUserRequest {
  userId: string;
  reason: string;
}

export interface SendNotificationRequest {
  recipientId?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

// Note: ApiResponse is defined above with default generic parameter

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
