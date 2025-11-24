import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";

type FavoriteItem = {
  id: number;
  name: string;
  sku: string;
  color: string;
  variant: string;
  price: number;
};

const favorites: FavoriteItem[] = [
  {
    id: 1,
    name: "CornPulse Wireless Earbuds",
    sku: "CE-TWS-8821",
    color: "Frost White",
    variant: "ANC + Transparency",
    price: 8999,
  },
  {
    id: 2,
    name: "CornGuard Tech Backpack",
    sku: "CE-BPK-6601",
    color: "Shadow Black",
    variant: "23L / Water-resistant",
    price: 14999,
  },
  {
    id: 3,
    name: "CornCharge GaN Fast Charger 120W",
    sku: "CE-CHG-4412",
    color: "Matte Graphite",
    variant: "3-Port USB-C / USB-A",
    price: 11999,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white">
        Favorites travel with you. Move to cart when you&apos;re ready.
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 lg:max-w-6xl lg:pb-16">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Favorites
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                Saved for later
              </h1>
              <p className="text-xs text-neutral-500">
                Tap to bag. Ultra-compact like Nike & Amazon mobile favorites.
              </p>
            </div>
            <span className="hidden rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 lg:inline-flex">
              {favorites.length} item{favorites.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item) => (
              <article
                key={item.id}
                className="group relative flex gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:border-neutral-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <button
                  type="button"
                  aria-label="Remove"
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 transition hover:text-neutral-700"
                >
                  <RemoveIcon />
                </button>

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 shadow-inner">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200/70">
                    <ProductIcon />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-[15px] font-semibold leading-tight text-neutral-900">
                    {item.name}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    In stock
                  </div>
                  <button className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7 text-neutral-700"
  >
    <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
    <path d="M3 10h18" />
    <path d="M10 14h4" />
  </svg>
);

const RemoveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
    aria-hidden
  >
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);
