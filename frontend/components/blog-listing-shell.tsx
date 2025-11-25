"use client";

import { useMemo, useState } from "react";

import { BlogCard } from "@/components/blog-card";
import { CategoryFilter } from "@/components/category-filter";
import { TrendingSidebar } from "@/components/trending-sidebar";

type Blog = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  readTime: string;
};

type TrendingItem = {
  id: string;
  title: string;
  image: string;
};

type Featured = {
  title: string;
  body: string;
  cta: string;
};

export function BlogListingShell({
  posts,
  trending,
  featured,
}: {
  posts: Blog[];
  trending: TrendingItem[];
  featured: Featured;
}) {
  const categories = ["All", "Charging", "Accessories", "Tech Tips", "News"];
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return posts;
    return posts.filter((post) => post.category === active);
  }, [active, posts]);

  return (
    <div className="space-y-8">
      <CategoryFilter categories={categories} active={active} onChange={setActive} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="hidden lg:block">
          <TrendingSidebar trending={trending} featured={featured} />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900">
          ←
        </button>
        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
              page === 1
                ? "border-transparent bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/20"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900">
          →
        </button>
      </div>
    </div>
  );
}
