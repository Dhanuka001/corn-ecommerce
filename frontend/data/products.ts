export type Product = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stockStatus: "in-stock" | "preorder" | "limited";
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  badge?: string;
  heroImage: string;
  gallery: string[];
  thumbnail: string;
  colors: { name: string; value: string }[];
  shippingEstimate: string;
  warranty: string;
  sku: string;
  release: string;
};

export const products: Product[] = [
  {
    slug: "atlas-smartwatch-ultra",
    name: "Atlas Smartwatch Ultra",
    price: 58900,
    oldPrice: 64900,
    rating: 4.9,
    reviews: 322,
    stockStatus: "in-stock",
    description:
      "Rugged, ocean-ready smartwatch with dual-frequency GPS, depth tracking, and 72-hour battery life tailored for Corn explorers.",
    highlights: [
      "Dual-frequency precision GPS",
      "Depth sensor + freedive mode",
      "72-hour adaptive battery profile",
      "Solar bolt charging ring",
    ],
    specs: [
      { label: "Display", value: "1.95” LTPO AMOLED, 1200 nits" },
      { label: "Body", value: "Grade-5 Titanium + Ceramic back" },
      { label: "Battery", value: "590mAh, up to 3 days mixed use" },
      { label: "Water Proof", value: "100m depth / IP68" },
      { label: "Connectivity", value: "Dual GPS, LTE, Wi-Fi 6, BT 5.3" },
    ],
    badge: "Bestseller",
    heroImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511732351157-1865efcb7b7b?auto=format&fit=crop&w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=70",
    colors: [
      { name: "Obsidian", value: "#0f0f10" },
      { name: "Polar Silver", value: "#f0f0f2" },
      { name: "Harvest Orange", value: "#ff8a3d" },
    ],
    shippingEstimate: "Dispatches within 24h from Colombo tech hub",
    warranty: "3-year Corn Elite warranty + accidental cover",
    sku: "CN-AT-ULTRA-01",
    release: "March 2025",
  },
  {
    slug: "lumen-smart-speaker-pro",
    name: "Lumen Smart Speaker Pro",
    price: 47900,
    oldPrice: 52900,
    rating: 4.7,
    reviews: 198,
    stockStatus: "in-stock",
    description:
      "360º cinematic audio with Corn Voice intelligence, adaptive EQ, and ambient lighting tuned for modern living rooms.",
    highlights: [
      "Spatial wave drivers",
      "Corn Voice + Matter ready",
      "Adaptive ambient lighting",
      "Wireless stereo pairing",
    ],
    specs: [
      { label: "Drivers", value: "2 × 3.5\" woofers + 5 beam tweeters" },
      { label: "Audio", value: "High-Res 24-bit/192kHz" },
      { label: "Connectivity", value: "Wi-Fi 6E, BT 5.4, Thread" },
      { label: "Assistant", value: "Corn Voice / Alexa / Google" },
      { label: "Finish", value: "Matte graphite acoustic mesh" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?auto=format&fit=crop&w=500&q=70",
    colors: [
      { name: "Graphite Mesh", value: "#2a2a2d" },
      { name: "Frost White", value: "#f4f5f6" },
    ],
    shippingEstimate: "Same-day delivery in Western Province",
    warranty: "2 years limited + 1 year Corn Care",
    sku: "CN-LM-PRO-02",
    release: "January 2025",
  },
  {
    slug: "aerolite-soundbuds-pro",
    name: "Aerolite SoundBuds Pro",
    price: 32900,
    oldPrice: 37900,
    rating: 4.6,
    reviews: 512,
    stockStatus: "limited",
    description:
      "Featherweight earbuds with adaptive ANC, dual drivers, and Corn Spatial Audio for immersive listening anywhere.",
    highlights: [
      "Adaptive triple-mode ANC",
      "Dual hybrid drivers",
      "Corn Spatial Audio",
      "Qi + USB-C fast case",
    ],
    specs: [
      { label: "Playback", value: "9 hrs buds / 36 hrs with case" },
      { label: "Charging", value: "10 min = 4 hr playback" },
      { label: "Durability", value: "IPX5 sweat + rain" },
      { label: "Audio", value: "AAC, LC3, LDAC certified" },
      { label: "Microphones", value: "6 beam-form mics" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=500&q=70",
    colors: [
      { name: "Pearl White", value: "#f9f8f5" },
      { name: "Shadow Black", value: "#1b1b1e" },
      { name: "Coral Pulse", value: "#ff5f6d" },
    ],
    shippingEstimate: "Dispatch in 12 hours — nationwide",
    warranty: "18 months Corn Soundcare",
    sku: "CN-AE-PRO-07",
    release: "November 2024",
  },
  {
    slug: "nova-home-security-hub",
    name: "Nova Home Security Hub",
    price: 89900,
    rating: 4.8,
    reviews: 141,
    stockStatus: "preorder",
    description:
      "Whole-home console with edge AI to orchestrate Corn sensors, cameras, and automations—privacy-first by design.",
    highlights: [
      "Edge AI scene detection",
      "Thread + Matter bridge",
      "24-hour battery backup",
      "Corn Secure LTE failover",
    ],
    specs: [
      { label: "Processor", value: "Corn M2 Secure Core" },
      { label: "Video", value: "Up to 8 4K camera feeds" },
      { label: "Storage", value: "512GB encrypted SSD" },
      { label: "Connectivity", value: "Wi-Fi 7, Thread, Zigbee" },
      { label: "Power", value: "AC + 24h LiFePO4 backup" },
    ],
    badge: "Preorder",
    heroImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=70",
    colors: [
      { name: "Chalk", value: "#f8f8f3" },
      { name: "Midnight", value: "#0d0f1a" },
    ],
    shippingEstimate: "Ships first week of July with priority air",
    warranty: "4 years mission control coverage",
    sku: "CN-NV-HUB-03",
    release: "July 2025",
  },
  {
    slug: "quartz-android-tablet",
    name: "Quartz Android Tablet",
    price: 98900,
    oldPrice: 109900,
    rating: 4.5,
    reviews: 88,
    stockStatus: "in-stock",
    description:
      "13-inch AMOLED tablet with Corn Pen 2 support, 120Hz panel, and studio-grade quad speakers for creative nomads.",
    highlights: [
      "13\" 120Hz AMOLED canvas",
      "Corn Pen 2 tilt + 4,096 pressure",
      "Snapdragon X Elite chipset",
      "Quad spatial speakers",
    ],
    specs: [
      { label: "Display", value: "2880 × 1800, 120Hz" },
      { label: "Processor", value: "Snapdragon X Elite" },
      { label: "Memory", value: "16GB LPDDR5X" },
      { label: "Storage", value: "512GB UFS 4.0" },
      { label: "Battery", value: "11,000mAh, 65W USB-C" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=70",
    colors: [
      { name: "Slate", value: "#3c4043" },
      { name: "Mist Blue", value: "#8fb6d9" },
      { name: "Corn Neon", value: "#ff1b1b" },
    ],
    shippingEstimate: "Doorstep in 2 days island-wide",
    warranty: "3 years tablet assurance + pen cover",
    sku: "CN-QT-TAB-04",
    release: "February 2025",
  },
  {
    slug: "volt-max-powerbank",
    name: "Volt Max Powerbank 30K",
    price: 19900,
    rating: 4.4,
    reviews: 643,
    stockStatus: "in-stock",
    description:
      "30,000 mAh pocket station with dual USB-C PD 140W, smart passthrough, and Corn thermal guard for safer fast charging.",
    highlights: [
      "140W dual USB-C PD",
      "Smart passthrough UPS mode",
      "Corn Thermal Guard 3",
      "Status OLED ring",
    ],
    specs: [
      { label: "Capacity", value: "30,000 mAh / 111 Wh" },
      { label: "Outputs", value: "2× USB-C, 1× USB-A QC 4" },
      { label: "Input", value: "USB-C 100W PD" },
      { label: "Safety", value: "UL, CE, Corn Thermal Guard" },
      { label: "Dimensions", value: "154 × 72 × 28 mm" },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=500&q=70",
    colors: [
      { name: "Carbon", value: "#111214" },
      { name: "Arctic", value: "#f5f7fb" },
    ],
    shippingEstimate: "Ready for pickup today in all Corn kiosks",
    warranty: "2 years rapid-charge care",
    sku: "CN-VT-PB-05",
    release: "September 2024",
  },
];

export const getProductBySlug = (slug: string) => {
  const normalized = slug?.trim().toLowerCase();
  return products.find((product) => product.slug === normalized);
};
