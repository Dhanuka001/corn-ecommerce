import type { ProductImage } from "./catalog";

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
  position: number;
  children?: AdminCategory[];
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description?: string | null;
  priceLKR: number;
  compareAtLKR?: number | null;
  stock: number;
  active: boolean;
  images: ProductImage[];
  categories: { id: string; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
};

export type AdminOrderItem = {
  id: string;
  name: string;
  sku: string;
  qty: number;
  unitLKR: number;
  lineTotalLKR: number;
};

export type AdminOrderAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district: string;
  postalCode?: string | null;
  country: string;
};

export type AdminOrderEvent = {
  id: string;
  type: string;
  note?: string | null;
  createdAt: string;
};

export type AdminPayment = {
  id: string;
  method: string;
  status: string;
  amountLKR: number;
  providerRef?: string | null;
};

export type AdminOrder = {
  id: string;
  orderNo: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subTotalLKR: number;
  shippingLKR: number;
  discountLKR: number;
  totalLKR: number;
  createdAt: string;
  items: AdminOrderItem[];
  shippingAddr: AdminOrderAddress;
  billingAddr: AdminOrderAddress;
  timeline: AdminOrderEvent[];
  payment?: AdminPayment | null;
  payhereRef?: string | null;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  } | null;
};

export type ShippingRate = {
  id: string;
  label: string;
  minSubtotalLKR: number;
  priceLKR: number;
};

export type ShippingZone = {
  id: string;
  name: string;
  districts: string[];
  rates: ShippingRate[];
};

export type StoreSetting = {
  id: number;
  codEnabled: boolean;
  payhereMerchantId?: string | null;
  payhereMerchantSecret?: string | null;
  payhereSandbox: boolean;
  shippingNotes?: string | null;
};

export type SettingsPayload = {
  settings: StoreSetting;
  shippingZones: ShippingZone[];
};

export type AdminUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  suspended: boolean;
  createdAt: string;
};

export type AdminOverview = {
  revenueLKR: number;
  totalOrders: number;
  totalUsers: number;
  lowStock: { id: string; name: string; slug: string; stock: number }[];
  recentOrders: {
    id: string;
    orderNo: string;
    totalLKR: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }[];
};

export type AuditLogEntry = {
  id: string;
  route: string;
  method: string;
  action?: string | null;
  before?: unknown;
  after?: unknown;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
  } | null;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};
