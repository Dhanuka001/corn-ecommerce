import type { ProductSummary, Variant } from "./catalog";

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  qty: number;
  unitLKR: number;
  lineTotalLKR: number;
  product: ProductSummary;
  variant?: Variant | null;
};

export type CartSummary = {
  subTotalLKR: number;
  totalQuantity: number;
};

export type Cart = {
  id: string;
  userId?: string | null;
  items: CartItem[];
  summary: CartSummary;
};
