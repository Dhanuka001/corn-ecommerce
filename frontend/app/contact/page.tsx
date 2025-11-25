import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ContactCard } from "@/components/contact-card";
import { ContactForm } from "@/components/contact-form";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SocialRow } from "@/components/social-row";

export default function ContactPage() {
  const quickContacts = [
    {
      title: "Email",
      value: "support@cornelectronics.lk",
      icon: <MailIcon />,
    },
    {
      title: "Phone / WhatsApp",
      value: "+94 77 123 4567",
      icon: <PhoneIcon />,
    },
    {
      title: "Location",
      value: "Pettah, Colombo 11, Sri Lanka",
      icon: <MapPinIcon />,
    },
    {
      title: "Hours",
      value: "Mon–Sat: 9 AM – 7 PM",
      icon: <ClockIcon />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <Navbar />

      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ED1C24]">
              Corn Support
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#0A1931] sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-3 text-base text-neutral-600 sm:text-lg">
              We’re here to help with anything related to mobile gadgets & accessories.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 space-y-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickContacts.map((card) => (
            <ContactCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
          <ContactForm />

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
              <div className="p-4">
                <p className="text-sm font-semibold text-[#0A0A0A]">Find us in Colombo</p>
                <p className="text-sm text-neutral-500">Pettah, Colombo 11</p>
              </div>
              <div className="h-64 overflow-hidden rounded-b-2xl">
                <iframe
                  title="Corn Electronics Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126739.63455394634!2d79.75313525559409!3d6.934996872777025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596d7d04b791%3A0x1a6f99d9db6466b1!2sPettah%2C%20Colombo%2011%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-md">
              <p className="text-sm font-semibold text-[#0A0A0A]">Connect</p>
              <p className="text-sm text-neutral-500">Follow Corn Electronics</p>
              <div className="mt-3">
                <SocialRow />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.81 12.81 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
