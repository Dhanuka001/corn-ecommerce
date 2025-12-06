import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const steps = [
  "Log in with your account so we can pull your order history.",
  "Choose an order and describe the question or issue in the message box.",
  "Our support team will reply via email within 24 hours with next steps.",
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Support Center</p>
          <h1 className="text-3xl font-semibold text-slate-900">We keep support simple.</h1>
          <p className="text-sm text-slate-600">
            Use the support center to submit missing order information, shipping questions, or device care requests.
          </p>
          <div className="space-y-3 text-sm text-slate-600">
            {steps.map((step, index) => (
              <p key={step}>
                {index + 1}. {step}
              </p>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
