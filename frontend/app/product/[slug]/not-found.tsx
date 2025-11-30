import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        PhoneBazzar.lk
      </p>
      <h1 className="text-3xl font-semibold text-slate-900">
        We could not locate that drop
      </h1>
      <p className="max-w-md text-sm text-slate-600">
        The product you are trying to view is no longer live. Browse
        the newest PhoneBazzar collections and limited releases.
      </p>
      <Link
        href="/#shop"
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600"
      >
        Return to shop
      </Link>
    </section>
  );
}
