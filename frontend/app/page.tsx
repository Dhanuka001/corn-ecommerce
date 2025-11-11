import { Hero } from "@/components/hero";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Navbar } from "@/components/navbar";
import { StorePerks } from "@/components/store-perks";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl space-y-10 py-10">
        <Hero />
        <StorePerks />
      </main>

      <MobileBottomNav />
    </div>
  );
}
