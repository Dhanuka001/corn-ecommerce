import Link from "next/link";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { getProducts } from "@/lib/getProducts";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 9);
  return (
    <div className="min-h-screen bg-white text-text">
      <Navbar />

      <HeroSection
        eyebrow="Women's new in"
        title="Everything new. Zero effort."
        subtitle="Daily drops, trend edits, and back-in-stock pieces before they go."
        ctaLabel="Shop women"
        ctaHref="#new-in"
        secondaryLabel="Shop sale"
        secondaryHref="#sale"
        imageSrc="https://i.pinimg.com/736x/49/0b/f6/490bf6fab1f98cc97a75914f878f4634.jpg"
        imageAlt="Model in neutral streetwear"
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <div className="animate-fade-in-up">
          <CategorySection
            title="Shop by category"
            categories={[
              { name: "Dresses", copy: "", href: "#dresses" },
              { name: "Coats & Jackets", copy: "", href: "#co-ords" },
              { name: "Knitwear", copy: "", href: "#knitwear" },
              { name: "Jeans", copy: "", href: "#denim" },
              { name: "Shoes", copy: "", href: "#shoes" },
              { name: "View all", copy: "", href: "#featured" },
            ]}
          />
        </div>

        <section
          id="sale"
          className="animate-fade-in-up overflow-hidden bg-text px-6 py-8 text-beige-light shadow-[0_20px_60px_-40px_rgba(26,26,26,0.6)]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-beige/80">Limited offer</p>
              <h3 className="text-2xl font-semibold tracking-tight">
                Up to 30% off dresses, co-ords & tailoring
              </h3>
              <p className="text-sm text-beige/90">
                Use code: NEUTRALS at checkout. Ends midnight.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#featured"
                className="rounded-full bg-beige-light px-5 py-3 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-beige/30"
              >
                Shop sale
              </Link>
              <Link
                href="#dresses"
                className="rounded-full border border-beige/60 px-5 py-3 text-sm font-semibold text-beige-light transition hover:-translate-y-0.5 hover:border-beige-light"
              >
                Shop dresses
              </Link>
            </div>
          </div>
        </section>

        <div id="new-in" className="animate-fade-in-up">
          <ProductGrid
            title="New in: women's edit"
            description="Fresh drops, restocks, and trending pieces just landed."
            products={featured}
          />
        </div>

        <div className="animate-fade-in-up">
          <Testimonials />
        </div>
      </main>

      <Footer />
    </div>
  );
}
