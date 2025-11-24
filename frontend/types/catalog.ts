export type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
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
};

export type ProductDetail = ProductSummary & {
  description?: string | null;
  variants: Variant[];
  categories: { id: string; slug: string; name: string }[];
};
