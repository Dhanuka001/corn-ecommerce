import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Returns & Warranty</p>
          <h1 className="text-3xl font-semibold text-slate-900">Straightforward returns.</h1>
          <p className="text-sm text-slate-600">
            Unopened items can be returned within 7 days for a full refund once the pieces arrive in their original packaging.
            Damaged or faulty items are handled through warranty repairs, and we will coordinate pickup or drop-off based on your location.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Ship the item back using the return label we email you.</li>
            <li>• We inspect and process refunds within 3 business days after receipt.</li>
            <li>• Warranty repairs are covered for 3 years unless otherwise noted.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
