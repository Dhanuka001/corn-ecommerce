import type { ProductSummary } from "./catalog";

export type FavoriteItem = {
  id: string;
  productId: string;
  createdAt: string;
  product: ProductSummary;
};
