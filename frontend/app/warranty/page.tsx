import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const warrantyPoints = [
  "3-year PhoneBazzar warranty on qualifying devices.",
  "Warranty service handled through local partners in Colombo and Kandy.",
  "Accidental damage cover and extended service plans available at checkout.",
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Warranty Policy</p>
          <h1 className="text-3xl font-semibold text-slate-900">Coverage you can count on.</h1>
          <p className="text-sm text-slate-600">
            Every device ships with the manufacturer warranty plus the PhoneBazzar commitment to fast repairs.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            {warrantyPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
