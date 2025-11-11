import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl  py-10">
        <Hero />
      </main>
    </div>
  );
}
