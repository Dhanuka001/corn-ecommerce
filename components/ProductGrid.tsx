import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  title?: string;
  description?: string;
  products: Product[];
};

export function ProductGrid({
  title = "Featured pieces",
  description = "A warm palette of essentials you can layer, lounge, and live in.",
  products,
}: ProductGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2>
          <p className="text-sm text-text/70">{description}</p>
        </div>
        <span className="text-sm font-medium text-text/70">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-text/20 bg-beige-light/60 px-6 py-10 text-center text-sm text-text/70">
          Nothing here yet. Check back after our next drop.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
