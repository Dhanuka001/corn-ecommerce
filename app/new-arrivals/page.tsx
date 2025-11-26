import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { getProducts } from "@/lib/getProducts";

export default async function NewArrivalsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-beige-light text-text">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-text/60">
            Collection 01 / New arrivals
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Fresh layers in warm neutrals.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-text/75 sm:text-lg">
            Sculpted silhouettes, airy knits, and modern essentials inspired by ZARA
            editorials—refined, minimal, and ready to mix.
          </p>
        </header>

        <ProductGrid
          title="New arrivals"
          description="Explore the latest drop from BeigeAura."
          products={products}
        />
      </main>

      <Footer />
    </div>
  );
}
