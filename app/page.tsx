import Image from "next/image";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { NewArrivalSection } from "@/components/NewArrivalSection";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { getProducts } from "@/lib/getProducts";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-beige-light text-text">
      <Navbar />

      <HeroSection
        eyebrow="The Soft Warm Minimal Aesthetic"
        title="Neutral silhouettes."
        subtitle="Structured ease in warm neutrals—tailored layers that move."
        ctaLabel="Shop collection"
        ctaHref="#featured"
        secondaryLabel="View lookbook"
        secondaryHref="#journal"
        imageSrc="/images/hero-female-pin.jpg"
        imageAlt="Premium female editorial look in warm beige tones"
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">

        <div className="animate-fade-in-up">
          <NewArrivalSection />
        </div>

        <div className="animate-fade-in-up">
          <CategorySection title="Shop by feeling" />
        </div>

        <div id="featured" className="animate-fade-in-up">
          <ProductGrid
            title="Featured essentials"
            description="Cozy knits, airy layers, and grounding staples in warm beige tones."
            products={featured}
          />
        </div>

        <section
          id="lifestyle"
          className="animate-fade-in-up overflow-hidden rounded-3xl border border-beige-dark/40 bg-white/80 shadow-[0_30px_80px_-60px_rgba(26,26,26,0.4)]"
        >
          <div className="grid items-center gap-0 md:grid-cols-2">
            <div className="space-y-4 px-8 py-12 md:px-10">
              <p className="text-xs uppercase tracking-[0.2em] text-text/60">
                Home Atmosphere
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Slow living, soft light.
              </h2>
              <p className="text-sm leading-relaxed text-text/75">
                Layer textiles, ceramics, and candlelight to create a calm retreat. Pair
                tactile throws with structured silhouettes for a space that feels
                intentional and lived-in.
              </p>
              <div className="flex gap-3">
                <a
                  href="#home"
                  className="rounded-full bg-text px-4 py-2 text-sm font-semibold text-beige-light transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-text/10"
                >
                  Explore home
                </a>
                <a
                  href="#journal"
                  className="rounded-full border border-text/20 px-4 py-2 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:border-text/40"
                >
                  Read journal
                </a>
              </div>
            </div>
            <div className="relative h-full w-full bg-beige">
              <Image
                src="/images/lifestyle-real.jpg"
                alt="Lifestyle collage"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <div className="animate-fade-in-up">
          <Testimonials />
        </div>
      </main>

      <Footer />
    </div>
  );
}
