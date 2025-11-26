import { apiRequest } from "./api";
import type {
  AdminCategory,
  AdminOrder,
  AdminOverview,
  AdminProduct,
  AdminUser,
  AuditLogEntry,
  Paginated,
  SettingsPayload,
  ShippingZone,
} from "@/types/admin";

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    search.append(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const fetchAdminOverview = async () =>
  apiRequest<{ overview: AdminOverview }>("/admin/overview", { method: "GET" });

export const fetchAdminProducts = async (params: {
  q?: string;
  page?: number;
  limit?: number;
}) =>
  apiRequest<Paginated<AdminProduct>>(
    `/admin/products${buildQuery({
      q: params.q,
      page: params.page,
      limit: params.limit,
    })}`,
    { method: "GET" },
  );

export const createAdminProduct = (payload: Partial<AdminProduct> & { categoryIds?: string[] }) =>
  apiRequest<{ product: AdminProduct }>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminProduct = (
  id: string,
  payload: Partial<AdminProduct> & { categoryIds?: string[] },
) =>
  apiRequest<{ product: AdminProduct }>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const addAdminProductImage = (
  id: string,
  payload: { url: string; alt?: string; position?: number },
) =>
  apiRequest<{ image: { id: string } }>(`/admin/products/${id}/images`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchAdminCategories = () =>
  apiRequest<{ categories: AdminCategory[] }>("/admin/categories", {
    method: "GET",
  });

export const createAdminCategory = (payload: Partial<AdminCategory>) =>
  apiRequest<{ category: AdminCategory }>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminCategory = (id: string, payload: Partial<AdminCategory>) =>
  apiRequest<{ category: AdminCategory }>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const fetchAdminOrders = (params: {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}) =>
  apiRequest<Paginated<AdminOrder>>(
    `/admin/orders${buildQuery({
      status: params.status,
      q: params.q,
      page: params.page,
      limit: params.limit,
    })}`,
    { method: "GET" },
  );

export const fetchAdminOrder = (id: string) =>
  apiRequest<{ order: AdminOrder }>(`/admin/orders/${id}`, { method: "GET" });

export const updateAdminOrderStatus = (id: string, status: string) =>
  apiRequest<{ order: AdminOrder }>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const markAdminOrderPaid = (id: string) =>
  apiRequest<{ order: AdminOrder }>(`/admin/orders/${id}/mark-paid`, {
    method: "PATCH",
  });

export const fetchAdminSettings = () =>
  apiRequest<SettingsPayload>("/admin/settings", { method: "GET" });

export const saveAdminSettings = (payload: {
  codEnabled?: boolean;
  payhereMerchantId?: string | null;
  payhereMerchantSecret?: string | null;
  payhereSandbox?: boolean;
  shippingNotes?: string | null;
  shippingZones?: ShippingZone[];
}) =>
  apiRequest<SettingsPayload>("/admin/settings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchAdminUsers = () =>
  apiRequest<Paginated<AdminUser>>("/admin/users", { method: "GET" });

export const updateAdminUser = (id: string, payload: Partial<AdminUser>) =>
  apiRequest<{ user: AdminUser }>(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const fetchAuditLogs = (params?: { page?: number; limit?: number }) =>
  apiRequest<Paginated<AuditLogEntry>>(
    `/admin/audit${buildQuery({ page: params?.page, limit: params?.limit })}`,
    { method: "GET" },
  );
