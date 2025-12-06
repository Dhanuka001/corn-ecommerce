export type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
};

export type Variant = {
  id: string;
  name: string;
  sku: string;
  priceLKR: number;
  stock: number;
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  priceLKR: number;
  compareAtLKR?: number | null;
  stock: number;
  images: ProductImage[];
  categories?: ProductCategory[];
};

import type { Review, ReviewSummary } from "./review";

export type ProductDetail = ProductSummary & {
  description?: string | null;
  variants: Variant[];
  categories: ProductCategory[];
  reviews?: Review[];
  reviewSummary?: ReviewSummary;
};

export type ProductListMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  priceRange?: { min: number; max: number };
};

export type ProductListResponse = {
  data: ProductSummary[];
  meta: ProductListMeta;
};

export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
  position: number;
  parentId?: string | null;
  children?: CatalogCategory[];
};
