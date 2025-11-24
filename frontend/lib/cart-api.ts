import { apiRequest } from "./api";
import type { Cart } from "@/types/cart";

export async function fetchCart(): Promise<Cart> {
  return apiRequest<Cart>("/cart", { method: "GET" });
}

export async function addCartItem(payload: {
  productId: string;
  variantId?: string | null;
  qty: number;
}): Promise<Cart> {
  return apiRequest<Cart>("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCartItemQuantity(payload: {
  itemId: string;
  qty: number;
}): Promise<Cart> {
  return apiRequest<Cart>(`/cart/items/${payload.itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ qty: payload.qty }),
  });
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  return apiRequest<Cart>(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}
