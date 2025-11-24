import { apiRequest } from "../api";

export type OrderItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  sku: string;
  qty: number;
  unitLKR: number;
  lineTotalLKR: number;
};

export type Order = {
  id: string;
  orderNo: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subTotalLKR: number;
  shippingLKR: number;
  discountLKR: number;
  totalLKR: number;
  createdAt: string;
  items: OrderItem[];
};

export async function getOrders(): Promise<{ orders: Order[] }> {
  return apiRequest<{ orders: Order[] }>("/orders/my", { method: "GET" });
}

export async function cancelOrder(id: string): Promise<{ order: Order }> {
  return apiRequest<{ order: Order }>(`/orders/${id}/cancel`, {
    method: "POST",
  });
}
