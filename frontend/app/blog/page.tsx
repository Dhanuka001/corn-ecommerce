import { BlogListingShell } from "@/components/blog-listing-shell";

const posts = [
  {
    id: "1",
    title: "5 Ways CornCharge GaN keeps your travel bag lighter",
    description:
      "Discover how CornCharge optimizes wattage, reduces bulk, and keeps every device topped up without carrying a brick.",
    category: "Charging",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
  },
  {
    id: "2",
    title: "CornGuard backpacks: inside our weather-ready shell",
    description:
      "We break down the new hydrophobic materials, hidden pockets, and airflow channels for all-day carry.",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    readTime: "3 min read",
  },
  {
    id: "3",
    title: "Fast charging myths debunked by Corn Labs",
    description:
      "A quick primer on voltage, amperage, and why smart GaN chargers protect batteries better than legacy bricks.",
    category: "Tech Tips",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
  },
  {
    id: "4",
    title: "CornPulse earbuds firmware 2.1: what’s new",
    description:
      "Spatial audio tuning, better mic isolation, and a new low-latency mode for creators and gamers.",
    category: "News",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
    readTime: "2 min read",
  },
  {
    id: "5",
    title: "Set up the ultimate bedside charging stack",
    description:
      "Build a clean, cable-free nightstand with CornBeam pads and multi-device stands for every ecosystem.",
    category: "Charging",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
  },
  {
    id: "6",
    title: "Designing Corn’s soft-touch finishes",
    description:
      "From renders to real life: how our industrial designers prototype the tactile coatings you feel every day.",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
  },
  {
    id: "7",
    title: "Corn Labs notebooks: where ideas ship",
    description:
      "Peek inside our Colombo prototyping lab and how we co-design new charging architectures.",
    category: "News",
    image:
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80",
    readTime: "3 min read",
  },
  {
    id: "8",
    title: "How to pick the right USB-C cable every time",
    description:
      "Understand PD profiles, e-markers, and how Corn cables are certified for faster, safer charging.",
    category: "Tech Tips",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
  },
];

const trending = [
  {
    id: "t1",
    title: "CornCharge 120W vs 65W: which one do you need?",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=70",
  },
  {
    id: "t2",
    title: "Behind the scenes of CornPulse ANC tuning",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=400&q=70",
  },
  {
    id: "t3",
    title: "Traveling with one Corn charger: our checklist",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=70",
  },
];

const featured = {
  title: "Corn Labs: inside our Colombo test bench",
  body: "Thermal chambers, drop rigs, and the engineers who obsess over your daily carry gear.",
  cta: "See the lab",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[#0A1931] sm:text-4xl">
            Latest Updates & Stories
          </h1>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg">
            Explore expert tips, product guides, and inside news from Corn Labs.
          </p>
        </div>

        <div className="mt-10">
          <BlogListingShell posts={posts} trending={trending} featured={featured} />
        </div>
      </div>
    </div>
  );
}
