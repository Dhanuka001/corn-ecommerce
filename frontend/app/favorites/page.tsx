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
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-3 text-center text-sm font-semibold tracking-tight text-white">
        Favorites synced across devices. Add to bag when you&apos;re ready.
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 lg:pt-12">
        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Favorites
                </p>
                <h1 className="text-3xl font-semibold text-neutral-900">
                  Saved for later
                </h1>
                <p className="text-sm text-neutral-600">
                  Premium picks you love. Move items to your bag anytime.
                </p>
              </div>
              <span className="hidden rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 lg:inline-flex">
                {favorites.length} item{favorites.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-44 w-full items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner">
                      <ProductIcon />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-neutral-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">SKU: {item.sku}</p>
                        <p className="text-xs text-neutral-600">
                          {item.color} · {item.variant}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/15"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-neutral-900">
                        {formatCurrency(item.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                          In stock
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-4">
                    <button
                      className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-50"
                      aria-label="Add to cart"
                    >
                      <CartIcon />
                      <span className="sr-only">Add to cart</span>
                    </button>
                    <button className="inline-flex justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                      Checkout
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="lg:w-80">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                Keep shopping
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Favorites stay saved while you browse.
              </p>
              <div className="mt-4 space-y-3">
                <button className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-white">
                  Back to home
                </button>
                <button className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-white">
                  View cart
                </button>
              </div>
            </div>
          </aside>
        </div>
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

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.34 16H19a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
