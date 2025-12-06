import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Privacy Policy</p>
          <h1 className="text-3xl font-semibold text-slate-900">We keep your data secure.</h1>
          <p className="text-sm text-slate-600">
            Personal data is only used to process orders, respond to inquiries, and improve the PhoneBazzar experience.
            We never sell or share your details beyond required logistics partners.
          </p>
          <p className="text-sm text-slate-600">
            You can review or delete your profile data by reaching out to hello@phonebazzar.lk.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
