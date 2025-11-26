import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductCard({ product }: ProductCardProps) {
  const cover = product.images[0] ?? "/images/cardigan1.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-beige-dark/30 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige-light">
        <Image
          src={cover}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text">{product.name}</p>
          <span className="text-sm font-semibold text-text/80">
            {priceFormatter.format(product.price / 100)}
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-text/60">
          {product.category}
        </p>
        <p className="line-clamp-2 text-sm leading-relaxed text-text/75">
          {product.description}
        </p>
      </div>
    </Link>
  );
}
