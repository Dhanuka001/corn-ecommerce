"use client";

import { useEffect, useState } from "react";

import { CategoryBrowser } from "@/components/category-browser";
import { Hero } from "@/components/hero";
import { LoadingOverlay } from "@/components/loading-overlay";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { StorePerks } from "@/components/store-perks";

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

        <main className="mx-auto w-full max-w-7xl space-y-4 py-10 sm:space-y-10">
          <Hero />
          <StorePerks />
          <CategoryBrowser />
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}
