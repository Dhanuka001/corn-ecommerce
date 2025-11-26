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

const stars = Array.from({ length: 5 });

export function ProductCard({ product }: ProductCardProps) {
  const cover = product.images[0] ?? "/images/cardigan1.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-beige-dark/20 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-text/5"
    >
      <div className="relative h-[520px] w-full overflow-hidden bg-beige-light">
        <div
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-text/50"
          style={{ writingMode: "vertical-rl" }}
        >
          BeigeAura — time to get dressed
        </div>
        <Image
          src={cover}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 90vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
          priority
        />
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-text/50">
          Since 2024
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text">{product.name}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-text/60">
              {product.category}
            </p>
          </div>
          <span className="text-sm font-semibold text-text">
            {priceFormatter.format(product.price / 100)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-text/50">
          {stars.map((_, idx) => (
            <span key={idx} className="text-base leading-none">
              ☆
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-text/10 pt-3">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-text">
            <span>Add to cart</span>
            <span>+</span>
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-text/70">
            <span>Favorite</span>
            <span className="text-lg leading-none">♡</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
