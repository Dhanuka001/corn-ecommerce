import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const highlights = [
  "We curate flagship devices and accessories with transparent Sri Lankan pricing.",
  "Every order is backed by local support, repair pathways, and honest dispatch times.",
  "Our catalog stays lean so each product is ready to ship from Colombo without delay.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">About PhoneBazzar</p>
          <h1 className="text-3xl font-semibold text-slate-900">A modern electronics boutique for Sri Lanka.</h1>
          <p className="text-sm text-slate-600">
            PhoneBazzar.lk launched to make buying premium tech in Sri Lanka effortless. We blend curated
            flagship devices, clear delivery expectations, and local care so customers feel confident from
            tap to doorstep.
          </p>
          <div className="space-y-2">
            {highlights.map((line) => (
              <p key={line} className="text-sm text-slate-600">
                {line}
              </p>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
