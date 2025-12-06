import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const contactPoints = [
  { label: "Sales & order help", detail: "hello@phonebazzar.lk" },
  { label: "WhatsApp support", detail: "+94 77 660 1146" },
  { label: "Office hours", detail: "Mon–Fri, 9am–6pm (GMT+5:30)" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Contact</p>
          <h1 className="text-3xl font-semibold text-slate-900">We are happy to help.</h1>
          <p className="text-sm text-slate-600">
            Reach out with any question about products, shipping, or after-sales support and we will respond within one business day.
          </p>
          <div className="space-y-3 text-sm text-slate-600">
            {contactPoints.map((point) => (
              <div key={point.label}>
                <p className="font-semibold text-slate-700">{point.label}</p>
                <p>{point.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
