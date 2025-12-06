import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Terms & Conditions</p>
          <h1 className="text-3xl font-semibold text-slate-900">Simple, transparent terms.</h1>
          <p className="text-sm text-slate-600">
            Orders are confirmed once payment is captured. Delivery dates are estimates and may shift during public holidays.
            We respect your right to cancel, return, or update your order before it ships.
          </p>
          <p className="text-sm text-slate-600">
            For the latest legal information, check with hello@phonebazzar.lk.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
