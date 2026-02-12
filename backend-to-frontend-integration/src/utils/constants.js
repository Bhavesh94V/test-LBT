export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const PROPERTY_STATUS = {
  NEWLY_LAUNCHED: 'newly-launched',
  UNDER_CONSTRUCTION: 'under-construction',
  READY_TO_MOVE: 'ready-to-move',
};

export const GROUP_STATUS = {
  OPEN: 'open',
  FILLING: 'filling',
  LOCKED: 'locked',
};

export const INQUIRY_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  REJECTED: 'rejected',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const PAYMENT_METHOD = {
  BANK_TRANSFER: 'bank-transfer',
  RAZORPAY: 'razorpay',
  UPI: 'upi',
  MANUAL: 'manual',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const NOTIFICATION_TYPE = {
  INQUIRY: 'inquiry',
  PAYMENT: 'payment',
  GROUP: 'group',
  PROPERTY: 'property',
  SYSTEM: 'system',
};

export const CONTACT_TYPE = {
  EMAIL: 'email',
  SMS: 'sms',
  CALL: 'call',
  WHATSAPP: 'whatsapp',
};

export const DELIVERY_CHANNEL = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in-app',
};
