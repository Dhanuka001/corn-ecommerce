"use client";

import { useMemo, useState } from "react";

const navGroups = [
  {
    title: "Overview",
    links: [
      "Dashboard",
      "eCommerce",
      "Analytics",
      "Marketing",
      "Automation",
    ],
  },
  {
    title: "Management",
    links: [
      "Products",
      "Orders",
      "Customers",
      "Discounts",
      "Fees & Taxes",
      "Content",
    ],
  },
  {
    title: "Settings",
    links: ["Team", "Billing", "Audit Logs"],
  },
];

const quickStats = [
  { label: "Customers", value: "3,920", change: "+12%", trend: "up" },
  { label: "Orders", value: "5,210", change: "-4%", trend: "down" },
  { label: "Revenue", value: "LKR 4.2M", change: "+18%", trend: "up" },
  { label: "Refunds", value: "62", change: "-10%", trend: "up" },
];

const monthlySales = [
  { month: "Jan", value: 240 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 320 },
  { month: "Apr", value: 280 },
  { month: "May", value: 360 },
  { month: "Jun", value: 220 },
  { month: "Jul", value: 400 },
  { month: "Aug", value: 370 },
  { month: "Sep", value: 300 },
  { month: "Oct", value: 420 },
  { month: "Nov", value: 380 },
  { month: "Dec", value: 450 },
];

const orderPipeline = [
  { stage: "New", value: 86 },
  { stage: "Packing", value: 54 },
  { stage: "Shipped", value: 112 },
  { stage: "Delivered", value: 398 },
  { stage: "Delayed", value: 9 },
];

const deliveryFees = [
  { region: "Colombo Metro", fee: "LKR 650", eta: "Same day" },
  { region: "Western Province", fee: "LKR 900", eta: "1-2 days" },
  { region: "Nationwide", fee: "LKR 1,200", eta: "2-4 days" },
];

const bannerCampaigns = [
  { name: "Hero Slider", status: "Live", variant: "Back to school" },
  { name: "Home Promo Card", status: "Scheduled", variant: "Festive deals" },
  { name: "App Launch Banner", status: "Draft", variant: "Corn App" },
];

const automationRules = [
  {
    name: "Auto Discount • Watches",
    detail: "Apply 8% off when stock > 500",
  },
  {
    name: "Trending Badge",
    detail: "Mark products with CTR > 4% as trending",
  },
  {
    name: "Abandoned Cart",
    detail: "Send reminder email after 6 hours",
  },
];

const tasks = [
  { title: "Approve vendor onboarding", due: "Due today" },
  { title: "Audit mobile hero banner", due: "Due tomorrow" },
  { title: "Review courier SLA report", due: "Fri" },
];

const bestSellers = [
  { name: "Corn Audio Pro", category: "Bluetooth Speaker", units: 842 },
  { name: "EcoCharge 65W", category: "Fast Charger", units: 691 },
  { name: "Vision Cam X", category: "Home Security", units: 512 },
];

const newVendors = [
  { name: "SoundStack", category: "Audio", rating: "4.8" },
  { name: "Lantern Living", category: "Home Tech", rating: "4.6" },
  { name: "Grid Mobility", category: "Accessories", rating: "4.9" },
];

const quickFilters = ["Trending", "New Arrivals", "Best Sellers"] as const;

export default function AdminDashboard() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof quickFilters)[number]>("Trending");

  const totalPipeline = useMemo(
    () => orderPipeline.reduce((sum, stage) => sum + stage.value, 0),
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-72 flex-shrink-0 border-r border-slate-100 bg-white px-6 py-8 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-semibold">
              C
            </div>
            <div>
              <p className="text-lg font-semibold">Corn Admin</p>
              <p className="text-xs text-slate-500">Control Center</p>
            </div>
          </div>

          <nav className="space-y-8">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-primary/10 hover:text-primary">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-10">
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden">
                ☰
              </button>
              <div className="flex-1">
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                  <span className="mr-2 text-lg">⌕</span>
                  <input
                    className="h-6 flex-1 bg-transparent outline-none"
                    placeholder="Search modules, orders, or run a command..."
                  />
                  <span className="rounded-lg bg-white px-2 py-0.5 text-xs text-slate-400">
                    ⌘ K
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600">
                  🔔
                </button>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    AD
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Admin Lead</p>
                    <p className="text-xs text-slate-500">Operations</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-10">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <span
                      className={`text-xs font-semibold ${
                        stat.trend === "up"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-slate-100">
                    <div
                      className="h-1 rounded-full bg-primary"
                      style={{
                        width: stat.trend === "up" ? "80%" : "55%",
                      }}
                    />
                  </div>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Monthly Sales</h3>
                    <p className="text-sm text-slate-500">
                      Jan - Dec (auto-updated)
                    </p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
                    Export
                  </button>
                </div>
                <div className="mt-6 flex h-56 items-end gap-3 rounded-2xl bg-slate-50 p-4">
                  {monthlySales.map((month) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div
                        className="w-6 rounded-full bg-primary/80"
                        style={{ height: `${month.value / 5}%` }}
                      />
                      <span className="mt-2 text-xs text-slate-500">
                        {month.month}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Monthly Target</h3>
                    <p className="text-sm text-slate-500">Smart goal tracker</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    +10%
                  </span>
                </div>
                <div className="mt-8 flex flex-col items-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#ff1b1b"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${0.76 * 2 * Math.PI * 45} ${
                          2 * Math.PI * 45
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <p className="text-3xl font-semibold">75.5%</p>
                      <p className="text-xs text-slate-500">Target ready</p>
                    </div>
                  </div>
                  <div className="mt-6 grid w-full grid-cols-3 text-center text-sm">
                    <div>
                      <p className="text-slate-500">Target</p>
                      <p className="font-semibold">LKR 5M</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Revenue</p>
                      <p className="font-semibold text-primary">LKR 4.2M</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Today</p>
                      <p className="font-semibold">LKR 320K</p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Order Pipeline</h3>
                  <p className="text-sm text-slate-500">
                    {totalPipeline} orders
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  {orderPipeline.map((stage) => (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-medium">{stage.stage}</p>
                        <p className="text-slate-500">{stage.value}</p>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(stage.value / totalPipeline) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Fulfillment Fees</h3>
                  <button className="text-sm font-medium text-primary">
                    Edit rules
                  </button>
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                  {deliveryFees.map((fee) => (
                    <div
                      key={fee.region}
                      className="flex items-center justify-between py-4"
                    >
                      <div>
                        <p className="font-semibold">{fee.region}</p>
                        <p className="text-sm text-slate-500">{fee.eta}</p>
                      </div>
                      <p className="font-semibold text-primary">{fee.fee}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Merchandising Controls
                    </h3>
                    <p className="text-sm text-slate-500">
                      Assign products to spotlight slots
                    </p>
                  </div>
                  <div className="flex gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm">
                    {quickFilters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-3 py-1 font-medium ${
                          activeFilter === filter
                            ? "bg-white text-primary shadow"
                            : "text-slate-500"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {bestSellers.map((product) => (
                    <div
                      key={product.name}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-600">
                        {product.category}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">
                        {product.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {product.units} weekly units
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary">
                          Mark Trending
                        </button>
                        <button className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary">
                          Feature Hero
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Automation Rules</h3>
                  <button className="text-sm font-semibold text-primary">
                    Add rule
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.name} className="rounded-xl bg-slate-50 p-4">
                      <p className="font-semibold">{rule.name}</p>
                      <p className="text-sm text-slate-500">{rule.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Banner & Content</h3>
                  <button className="text-sm font-semibold text-primary">
                    New asset
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {bannerCampaigns.map((campaign) => (
                    <div
                      key={campaign.name}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold">{campaign.name}</p>
                        <p className="text-sm text-slate-500">
                          {campaign.variant}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          campaign.status === "Live"
                            ? "bg-emerald-50 text-emerald-600"
                            : campaign.status === "Scheduled"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Vendor Spotlight</h3>
                  <button className="text-sm font-semibold text-primary">
                    Invite vendor
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {newVendors.map((vendor) => (
                    <div
                      key={vendor.name}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold">{vendor.name}</p>
                        <p className="text-sm text-slate-500">
                          {vendor.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        ★ {vendor.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Discounts & Fees</h3>
                  <button className="text-sm font-semibold text-primary">
                    Configure
                  </button>
                </div>
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                    <span>Festival Auto Discount</span>
                    <span className="font-semibold text-primary">12% off</span>
                  </li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                    <span>Same-day Handling Fee</span>
                    <span className="font-semibold">LKR 350</span>
                  </li>
                  <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                    <span>COD Surcharge</span>
                    <span className="font-semibold">LKR 150</span>
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Operations Tasks</h3>
                  <button className="text-sm font-semibold text-primary">
                    Manage
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {tasks.map((task) => (
                    <label
                      key={task.title}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.due}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Announcements</h3>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="rounded-xl bg-primary/10 p-4">
                    <p className="font-semibold text-primary">
                      Delivery partner upgrade
                    </p>
                    <p className="text-slate-600">
                      New SLA template applied to island-wide shipments.
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">
                      Mobile release window
                    </p>
                    <p className="text-slate-600">
                      Update landing banners before Thursday 2 PM.
                    </p>
                  </div>
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
