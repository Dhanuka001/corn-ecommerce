import Image from "next/image";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

type TestimonialsProps = {
  testimonials?: Testimonial[];
};

const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "Structured ease in warm neutrals. Every piece feels intentional, soft, and elevated.",
    name: "Elena Martins",
    role: "Stylist",
    avatar: "/images/hero-female-premium.jpg",
  },
  {
    quote:
      "Layerable silhouettes that carry from morning light to evening plans—my go-to capsule.",
    name: "Sara Quinn",
    role: "Customer",
    avatar: "/images/hero-female.jpg",
  },
];

export function Testimonials({ testimonials = defaultTestimonials }: TestimonialsProps) {
  const first = testimonials[0];

  return (
    <section className="relative overflow-hidden bg-[#f7f7f7] py-16 text-center text-text">
      <div className="absolute inset-0 flex items-center justify-center text-[96px] font-black uppercase tracking-tight text-text/5 pointer-events-none">
        Testimony
      </div>
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-text/50"
        style={{ writingMode: "vertical-rl" }}
      >
        BeigeAura — time to get dressed
      </div>
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-text/50"
        style={{ writingMode: "vertical-rl" }}
      >
        Since 2024
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
        <div className="relative h-24 w-24">
          <Image
            src={first.avatar}
            alt={first.name}
            fill
            className="rounded-full object-cover shadow-lg"
            sizes="120px"
            priority
          />
          <div className="absolute -right-2 bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-semibold text-text shadow">
            “
          </div>
        </div>

        <p className="text-base leading-7 text-text/75">{first.quote}</p>

        <div className="space-y-1">
          <div className="text-lg font-semibold text-text">{first.name}</div>
          <div className="text-sm text-text/60">{first.role}</div>
        </div>

        <div className="flex items-center gap-2 pt-2 text-text/40">
          {testimonials.map((item, idx) => (
            <span
              key={item.name + idx}
              className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-text/60" : "bg-text/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
