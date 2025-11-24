const posts = [
  {
    title: "Battery safety at Corn: what is next?",
    excerpt:
      "Peek inside the Corn energy lab to see how we stress test every Volt power cell before launch.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "What charger does your new device need?",
    excerpt:
      "USB-C tips, wired vs. wireless charging comparisons, and the Corn accessories we pair with iPhone 16.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Facts 101: are all USB-C cables the same?",
    excerpt:
      "We break down PD wattage, e-marked cables, and why Corn braids every cable for travel durability.",
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Wireless charging: what you need to know",
    excerpt:
      "From Qi2 certification to MagSafe alignment, here is the latest from Corn Labs.",
    image:
      "https://images.unsplash.com/photo-1555617983-ccfcf4d5dcd7?auto=format&fit=crop&w=800&q=80",
  },
];

export function BlogHighlights() {
  return (
    <section
      id="blog"
      className="px-4 py-14 sm:py-16"
      aria-label="Featured blogs"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold text-slate-900">
            Featured blogs & updates
          </h2>
          <button className="text-sm font-semibold text-primary transition hover:text-red-500">
            All blogs →
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {posts.map((post) => (
            <article
              key={post.title}
              className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] border border-slate-100 shadow-sm"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%), url(${post.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="space-y-2 p-6 text-white">
                <p className="text-lg font-semibold leading-tight">
                  {post.title}
                </p>
                <p className="text-sm text-white/80">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
