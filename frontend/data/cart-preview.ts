export type CartPreviewItem = {
  id: string;
  name: string;
  variant?: string;
  colorway?: string;
  qty: number;
  priceLKR: number;
  compareAtLKR?: number;
  imageAlt?: string;
};

export const demoCartItems: CartPreviewItem[] = [
  {
    id: "cart-item-1",
    name: "Cornium Arc Wireless Headphones",
    variant: "Matte Black",
    colorway: "Onyx Black",
    qty: 1,
    priceLKR: 42900,
    compareAtLKR: 48900,
  },
  {
    id: "cart-item-2",
    name: "Pulse Mini Smart Speaker",
    variant: "Cloud White",
    colorway: "Cloud White",
    qty: 2,
    priceLKR: 18990,
  },
  {
    id: "cart-item-3",
    name: "VoltGo 65W GaN Charger",
    variant: "Universal Kit",
    colorway: "Graphite",
    qty: 1,
    priceLKR: 14450,
  },
];
