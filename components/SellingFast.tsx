import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

type SellingFastProps = {
  products: Product[];
};

const priceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function SellingFast({ products }: SellingFastProps) {
  const visible = products.slice(0, 4);

  return (
    <section id="selling-fast" className="space-y-10">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-text/60">Quick edit</p>
        <h2 className="text-2xl font-semibold tracking-tight text-text md:text-3xl">
          Selling fast
        </h2>
        <p className="text-sm text-text/60">
          In-stock now and moving quickly—don&apos;t wait if you love it.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => {
          const current = product.price / 100;
          const was = Math.round(current * 1.35 * 100) / 100;
          const cover =
            product.images[0] ??
            "https://i.pinimg.com/736x/56/f9/71/56f971f986719bacb99be935ab3a44dd.jpg";
          const discount = Math.max(5, Math.round(((was - current) / was) * 100));

          return (
            <div key={product.id} className="space-y-3">
              <Link
                href={`/products/${product.slug}`}
                className="group block overflow-hidden bg-beige-light transition hover:-translate-y-1 hover:shadow-[0_24px_70px_-50px_rgba(26,26,26,0.65)]"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={cover}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 90vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70 transition duration-300 group-hover:opacity-90" />
                  <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text shadow-md">
                    <span>{discount}% off</span>
                    <span className="h-1 w-1 rounded-full bg-text/50" />
                    <span>Limited</span>
                  </div>
                </div>
              </Link>

              <div className="space-y-2 text-sm text-text">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text/60">
                  BeigeAura Design
                </p>
                <p className="text-base font-semibold leading-snug text-text group-hover:underline group-hover:underline-offset-4">
                  {product.name}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-lg font-semibold text-text">
                    {priceFormatter.format(current)}
                  </span>
                  <span className="text-text/50 line-through">{priceFormatter.format(was)}</span>
                  <span className="rounded-full border border-text/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text/70">
                    Limited
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link
          href="#featured"
          className="inline-flex items-center justify-center border border-text/15 bg-text px-10 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-beige-light transition hover:-translate-y-0.5 hover:border-text/30 hover:shadow-lg hover:shadow-text/10"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
