import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const highlights = [
  "Same-day dispatch from Colombo for orders placed before 3pm.",
  "Island-wide delivery in 1-3 business days depending on your district.",
  "Shipping is calculated per zone and shown before checkout.",
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Orders & Shipping</p>
          <h1 className="text-3xl font-semibold text-slate-900">Reliable delivery across Sri Lanka.</h1>
          <p className="text-sm text-slate-600">
            Shipping is available to every registered address with district information. We partner with trusted couriers to keep all deliveries trackable.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            {highlights.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
