"use client";

import { useState } from "react";

const posts = [
  {
    title: "Battery safety at PhoneBazzar: what is next?",
    excerpt:
      "Peek inside the PhoneBazzar energy lab to see how we stress test every Volt power cell before launch.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    details:
      "We take a close look at thermal cycling, drop tests, and the electronics that keep your battery safe even in Sri Lanka’s heat.",
  },
  {
    title: "What charger does your new device need?",
    excerpt:
      "USB-C tips, wired vs. wireless charging comparisons, and the PhoneBazzar accessories we pair with iPhone 16.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    details:
      "We break down USB Power Delivery, wattage tiers, and which PhoneBazzar cables and adapters we recommend for iPhone 16.",
  },
  {
    title: "Facts 101: are all USB-C cables the same?",
    excerpt:
      "We break down PD wattage, e-marked cables, and why PhoneBazzar braids every cable for travel durability.",
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    details:
      "Not all cables include the same wire gauge. Learn how PhoneBazzar tests safety, durability, and speed before we ship a USB-C cable.",
  },
  {
    title: "Wireless charging: what you need to know",
    excerpt:
      "From Qi2 certification to MagSafe alignment, here is the latest from PhoneBazzar Labs.",
    image:
      "https://images.unsplash.com/photo-1555617983-ccfcf4d5dcd7?auto=format&fit=crop&w=800&q=80",
    details:
      "Learn how to align your pad, avoid overheating, and when PhoneBazzar recommends staying wired for fast top-ups.",
  },
];

export function BlogHighlights() {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const togglePost = (title: string) => {
    setExpandedPost((current) => (current === title ? null : title));
  };

  return (
    <section
      id="blog"
      className="px-4 py-14 sm:py-16"
      aria-label="Featured blogs"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-3xl font-semibold text-slate-900">
          Featured blogs & updates
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {posts.map((post) => {
            const isExpanded = expandedPost === post.title;
            return (
              <article
                key={post.title}
                className={`relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] border border-slate-100 shadow-sm transition-all duration-300 ${isExpanded ? "md:col-span-2 shadow-2xl" : ""} cursor-pointer`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%), url(${post.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => togglePost(post.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    togglePost(post.title);
                  }
                }}
                aria-expanded={isExpanded}
              >
                <div className="space-y-2 p-6 text-white">
                  <p className="text-lg font-semibold leading-tight">
                    {post.title}
                  </p>
                  <p className="text-sm text-white/80">{post.excerpt}</p>
                  {isExpanded ? (
                    <p className="text-sm text-white/80">{post.details}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
