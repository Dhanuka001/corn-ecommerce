import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";

type CartItem = {
  id: number;
  name: string;
  sku: string;
  color: string;
  variant: string;
  shippingMethod: string;
  price: number;
  quantity: number;
};

const items: CartItem[] = [
  {
    id: 1,
    name: "CornBeam Noise-Canceling Headphones",
    sku: "CE-HDP-9932",
    color: "Onyx Black",
    variant: "Over-Ear",
    shippingMethod: "Ship to address",
    price: 259.99,
    quantity: 1,
  },
  {
    id: 2,
    name: "CornCharge GaN Fast Charger 120W",
    sku: "CE-CHG-4412",
    color: "Matte Graphite",
    variant: "3-Port USB-C / USB-A",
    shippingMethod: "Ship to address",
    price: 119.99,
    quantity: 1,
  },
];

const perks = [
  { title: "Faster checkout", subtitle: "Save addresses & preferences." },
  { title: "Hassle-free returns", subtitle: "Instant labels and updates." },
  { title: "Real-time tracking", subtitle: "Stay updated at every step." },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);

export default function CartPage() {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const estimatedShipping = 14.99;
  const estimatedTax = 0;
  const estimatedTotal = subtotal + estimatedShipping + estimatedTax;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="bg-neutral-900 px-4 py-3 text-center text-sm font-semibold tracking-tight text-white">
        Free U.S. shipping over $99 + free returns. Corn Club unlocks early
        drops.
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.9fr)]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Members save more
                  </p>
                  <p className="text-sm text-neutral-600">
                    Log in or register for priority shipping and rewards.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:shadow-sm">
                    Register
                  </button>
                  <button className="rounded-full border border-primary bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                    Log in
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {perks.map((perk) => (
                  <div
                    key={perk.title}
                    className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
                  >
                    <ArrowIcon />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {perk.title}
                      </p>
                      <p className="text-xs text-neutral-600">{perk.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-neutral-900">
                  Your Bag
                </h1>
                <span className="text-sm font-medium text-neutral-500">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                Review items, delivery, and quantities. Cart stays on the left,
                summary on the right.
              </p>
            </div>

            <div className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {items.map((item) => (
                <article key={item.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 sm:w-32">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner">
                        <ProductIcon />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-neutral-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Color: {item.color} · {item.variant}
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-[auto,1fr] sm:items-center">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-semibold text-neutral-800">
                            Qty
                          </label>
                          <div className="flex h-10 items-center rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-900 shadow-inner">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <label className="flex items-center gap-2 font-semibold text-neutral-800">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300">
                              <span className="h-2 w-2 rounded-full bg-neutral-900" />
                            </span>
                            {item.shippingMethod}
                          </label>
                          <button className="text-neutral-500 transition hover:text-neutral-900">
                            Save for later
                          </button>
                          <button className="text-neutral-500 transition hover:text-neutral-900">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </section>

          <aside className="lg:sticky lg:top-12">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
              <div className="border-b border-neutral-100 px-6 py-5">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="space-y-2 text-sm text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal ({items.length})</span>
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated tax</span>
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(estimatedTax)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated shipping</span>
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(estimatedShipping)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Estimated total
                    </p>
                    <p className="text-xs text-neutral-500">
                      Pay in 4 with Klarna available
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-neutral-900">
                    {formatCurrency(estimatedTotal)}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
                    Apply promo code
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="h-11 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none ring-0 transition focus:border-neutral-900 focus:bg-white"
                    />
                    <button className="h-11 rounded-xl border border-neutral-900 px-5 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow-lg">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:shadow-xl">
                    Checkout
                  </button>
                  <button className="h-12 w-full rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:-translate-y-[2px] hover:shadow-lg">
                    PayPal
                  </button>
                </div>
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

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="mt-0.5 h-5 w-5 text-neutral-900"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m0 0L13.5 5.25M20.25 12 13.5 18.75"
    />
  </svg>
);

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
