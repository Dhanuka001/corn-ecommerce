import { BestSellingCarousel } from "@/components/best-selling-carousel";
import { CategoryBrowser } from "@/components/category-browser";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HomeOverlay } from "@/components/home-overlay";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { StorePerks } from "@/components/store-perks";
import { Testimonials } from "@/components/testimonials";
import { NewArrivals } from "@/components/new-arrivals";

export default function Home() {
  return (
    <>
      <HomeOverlay />
      <div className="min-h-screen bg-zinc-50">
        <Navbar />

        <main className="space-y-10 pb-10">
          <Hero />
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-0">
            <StorePerks />
            <CategoryBrowser />
            <NewArrivals />
            <BestSellingCarousel />
            <Testimonials />
          </div>
        </main>

        <Footer />

        <MobileBottomNav />
      </div>
    </>
  );
}
