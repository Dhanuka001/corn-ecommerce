"use client";

import { useEffect, useState } from "react";

import { BestSellingCarousel } from "@/components/best-selling-carousel";
import { BlogHighlights } from "@/components/blog-highlights";
import { CategoryBrowser } from "@/components/category-browser";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LoadingOverlay } from "@/components/loading-overlay";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { StorePerks } from "@/components/store-perks";
import { Testimonials } from "@/components/testimonials";
import { NewArrivals } from "@/components/new-arrivals";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      const timeoutId = window.setTimeout(handleLoad, 150);
      return () => window.clearTimeout(timeoutId);
    }

    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div
        className={`min-h-screen bg-zinc-50 transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />

        <main className="space-y-10 pb-10">
          <Hero />
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-0">
            <StorePerks />
            <CategoryBrowser />
            <NewArrivals />
            <BestSellingCarousel />
            <Testimonials />
            <BlogHighlights />
          </div>
        </main>

        <Footer />

        <MobileBottomNav />
      </div>
    </>
  );
}
