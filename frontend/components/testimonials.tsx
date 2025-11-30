const testimonials = [
  {
    name: "Levi S.",
    initials: "Le",
    title: "PhoneBazzar Volt Power Hub",
    quote:
      "Excellent product. Perfect for my MacBook and camera setup. I love the PhoneBazzar build quality and the finish matches everything on my desk.",
  },
  {
    name: "Kyle R.",
    initials: "Ky",
    title: "PhoneBazzar Atlas Smartwatch",
    quote:
      "So good we grabbed two — one for home workouts and one for hikes. Battery life is unreal and the UI feels premium.",
  },
  {
    name: "Justin",
    initials: "Ju",
    title: "PhoneBazzar Air Lite Buds",
    quote:
      "Tuned EQ is on point. ANC kills the city noise and the case clicks shut like luxury. PhoneBazzar nailed this drop.",
  },
  {
    name: "Robert F.",
    initials: "Ro",
    title: "PhoneBazzar Prime Dock",
    quote:
      "My honest opinion? This thing is a powerhouse. Makes my hybrid setup simple and still looks clean on the shelf.",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-14 sm:py-16" aria-label="Customer testimonials">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Straight from our fans
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Loved by the PhoneBazzar community
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex h-full flex-col gap-5 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"
            >
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <div className="text-sm text-primary">★★★★★</div>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  {testimonial.initials}
                </span>
              </header>

              <p className="text-sm text-slate-700">
                “{testimonial.quote}”
              </p>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                {testimonial.title}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
