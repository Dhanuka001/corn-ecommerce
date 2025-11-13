"use client";

import { useMemo, useState, type SVGAttributes } from "react";

import { useAuth } from "@/context/auth-context";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const DashboardIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z" />
  </svg>
);

const OrdersIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M3 7h18M3 12h18M7 22h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z" />
  </svg>
);

const DownloadIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M12 3v14" />
    <path d="m5 12 7 7 7-7" />
    <path d="M5 21h14" />
  </svg>
);

const AddressIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
    <circle cx="12" cy="11" r="2" />
  </svg>
);

const DetailsIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="6" r="4" />
    <path d="M6 20a6 6 0 0 1 12 0" />
  </svg>
);

const LogoutIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const navigationItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Overview & profile",
    icon: DashboardIcon,
  },
  {
    key: "orders",
    label: "Orders",
    description: "Track deliveries & invoices",
    icon: OrdersIcon,
  },
  {
    key: "downloads",
    label: "Downloads",
    description: "Invoices & warranties",
    icon: DownloadIcon,
  },
  {
    key: "addresses",
    label: "Addresses",
    description: "Shipping & billing details",
    icon: AddressIcon,
  },
  {
    key: "details",
    label: "Account Details",
    description: "Profile & security",
    icon: DetailsIcon,
  },
] as const;

type SectionKey = (typeof navigationItems)[number]["key"];

export default function AccountPage() {
  const { user, openAuth, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = useMemo(() => {
    if (!user) return "";
    if (user.firstName) {
      const lastInitial = user.lastName?.[0]?.toUpperCase() ?? "";
      return `${user.firstName[0]?.toUpperCase() ?? ""}${lastInitial}`;
    }
    return user.email?.slice(0, 2).toUpperCase();
  }, [user]);

  const membershipDate = useMemo(() => {
    if (!user) return "";
    const joinedYear = new Date().getFullYear() - 1;
    return `Member since ${joinedYear}`;
  }, [user]);

  const requestLogout = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const renderSectionContent = () => {
    if (!user) {
      return (
        <section className="rounded-[32px] border border-slate-100 bg-white p-10 text-center shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
          <p className="text-2xl font-semibold text-slate-900">
            Ready to personalize your experience?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Save addresses, sync your wishlist, and enjoy faster checkout when you create an
            account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#e21717]"
              onClick={() => openAuth("login")}
            >
              Sign In
            </button>
            <button
              className="rounded-full border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/5"
              onClick={() => openAuth("register")}
            >
              Create Account
            </button>
          </div>
        </section>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    Hello {user.firstName ?? user.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    View recent orders, manage addresses, and update account details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={requestLogout}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                >
                  Sign out
                </button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Open orders", value: "02" },
                  { label: "Downloads", value: "04" },
                  { label: "Wishlist", value: "06" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5 text-center"
                  >
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-slate-900">Account details</h2>
              <p className="text-sm text-slate-500">
                Keep your contact details up to date so deliveries are never delayed.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <span className="text-slate-500">First name</span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                    {user.firstName ?? "—"}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <span className="text-slate-500">Last name</span>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                    {user.lastName ?? "—"}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <span className="text-slate-500">Email address</span>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                  {user.email}
                </div>
              </div>
            </section>
          </>
        );
      case "orders":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <p className="text-xl font-semibold text-slate-900">You don&apos;t have any orders!</p>
            <p className="mt-2 text-sm text-slate-500">
              Every order you place will show up here with tracking details.
            </p>
            <button className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
              Start shopping
            </button>
          </section>
        );
      case "downloads":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <p className="text-xl font-semibold text-slate-900">No downloads yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Digital receipts and warranty documents will appear once you make a purchase.
            </p>
          </section>
        );
      case "addresses":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Saved addresses</h2>
                <p className="text-sm text-slate-500">
                  Add shipping and billing details for faster checkout.
                </p>
              </div>
              <button className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
                Add address
              </button>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No addresses yet.
            </div>
          </section>
        );
      case "details":
        return (
          <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-slate-900">Account preferences</h2>
            <p className="text-sm text-slate-500">
              Manage password, notifications, and privacy controls.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Password", description: "Last updated 90 days ago", action: "Update" },
                {
                  label: "Two-factor authentication",
                  description: "Add an extra layer of security",
                  action: "Enable",
                },
                {
                  label: "Notifications",
                  description: "Choose how Corn contacts you",
                  action: "Manage",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 lg:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Account Center
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
              {user ? "My Account" : "Manage your account"}
            </h1>
            <p className="mt-2 text-base text-slate-500">
              {user
                ? "View your orders, addresses, downloads, and update your profile in one place."
                : "Sign in to see your dashboard, orders, and personalize your experience."}
            </p>
          </div>
          {user && (
            <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
              {membershipDate}
            </span>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row ">
          <aside className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] min-h-[420px]">
            {user ? (
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50/60 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold uppercase text-primary">
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                      : user.email}
                  </p>
                  <p className="text-sm text-slate-500">Corn Electronics</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50/60 p-4 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Join Corn Electronics
                </p>
                <p className="text-sm text-slate-500">
                  Unlock faster checkout, saved addresses, and VIP perks.
                </p>
              </div>
            )}

            <nav className="mt-6 grid grid-cols-2 gap-2 lg:block lg:space-y-2">
            {navigationItems.map(({ key, label, description, icon: Icon }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSection(key)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-slate-100 text-slate-600 hover:border-primary/20 hover:bg-primary/5 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="flex flex-col text-sm">
                    <span className={`font-semibold ${isActive ? "text-white" : "text-slate-900"}`}>
                      {label}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        isActive ? "text-white/80" : "text-slate-400"
                      }`}
                    >
                      {description}
                    </span>
                  </span>
                </button>
              );
            })}

            {user && (
              <button
                type="button"
                onClick={requestLogout}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-primary">
                  <LogoutIcon size={18} />
                </span>
                Logout
              </button>
            )}
          </nav>
          </aside>

          <div className="w-full lg:w-2/3 space-y-6 h-full">{renderSectionContent()}</div>
        </div>
      </main>
      <MobileBottomNav />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LogoutIcon size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Sign out of Corn?</h3>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ll need to log back in to manage your orders, downloads, and wishlist.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e21717]"
                onClick={handleLogoutConfirm}
              >
                Yes, sign me out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
