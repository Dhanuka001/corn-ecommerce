"use client";

import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { BlogHighlights } from "@/components/blog-highlights";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-neutral-900">
      <Navbar />

      <main className="pb-16 pt-10">
        <BlogHighlights />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
