import products from "@/data/products.json";

export const getProducts = async () => {
  return products;
};

export const getProduct = async (slug: string) => {
  return products.find((p) => p.slug === slug);
};
