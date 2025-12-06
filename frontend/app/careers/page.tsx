import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const openings = [
  "Customer experience specialist",
  "Warehouse & logistics coordinator",
  "Product catalog curator",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Careers</p>
          <h1 className="text-3xl font-semibold text-slate-900">Join the PhoneBazzar team.</h1>
          <p className="text-sm text-slate-600">
            We are building a practical ecommerce shop rooted in Sri Lanka. Every teammate keeps the experience
            fast, honest, and dependable for our customers.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            {openings.map((role) => (
              <p key={role}>• {role}</p>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            Send your CV and a short message to hello@phonebazzar.lk. We will be in touch about the next steps.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
