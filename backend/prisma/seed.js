const prisma = require("../src/lib/prisma");

// Cloudinary placeholder helper so we can swap to real folders later without touching seed data.
const placeholderImage = (slug, index) =>
  `https://res.cloudinary.com/demo/image/upload/v1710000000/corn/${slug}-${index}.jpg`;

const categorySeeds = [
  { slug: "wearables", name: "Wearables", position: 1 },
  { slug: "audio", name: "Audio", position: 2 },
  { slug: "smart-home", name: "Smart Home", position: 3 },
  { slug: "chargers", name: "Chargers & Power", position: 4 },
  { slug: "lifestyle", name: "Lifestyle Tech", position: 5 },
];

const productSeeds = [
  {
    slug: "ecocharge-65w",
    name: "EcoCharge 65W GaN Charger",
    sku: "CE-CH-001",
    description:
      "Compact GaN power adapter with USB-C PD supporting laptops, tablets, and phones.",
    priceLKR: 14900,
    compareAtLKR: 17900,
    stock: 240,
    categories: ["chargers"],
    images: [
      { url: placeholderImage("ecocharge-65w", 1), alt: "EcoCharge front" },
      { url: placeholderImage("ecocharge-65w", 2), alt: "EcoCharge ports" },
    ],
    variants: [
      { name: "White", sku: "CE-CH-001-W", priceLKR: 14900, stock: 120 },
      { name: "Black", sku: "CE-CH-001-B", priceLKR: 14900, stock: 120 },
    ],
  },
  {
    slug: "corn-flex-cable",
    name: "Corn Flex 2m USB-C Cable",
    sku: "CE-CB-002",
    description: "Kevlar reinforced 2m USB-C cable rated for 100W charging.",
    priceLKR: 3900,
    compareAtLKR: 4500,
    stock: 600,
    categories: ["chargers"],
    images: [{ url: placeholderImage("corn-flex-cable", 1) }],
  },
  {
    slug: "sound-orbit-mini",
    name: "Sound Orbit Mini Speaker",
    sku: "CE-AU-003",
    description:
      "Pocket-sized Bluetooth speaker with 360° audio and IP67 resistance.",
    priceLKR: 12900,
    compareAtLKR: 14900,
    stock: 180,
    categories: ["audio", "lifestyle"],
    images: [{ url: placeholderImage("sound-orbit-mini", 1) }],
    variants: [
      { name: "Sunset Orange", sku: "CE-AU-003-O", priceLKR: 12900, stock: 60 },
      { name: "Matte Black", sku: "CE-AU-003-B", priceLKR: 12900, stock: 70 },
      { name: "Ice Blue", sku: "CE-AU-003-I", priceLKR: 12900, stock: 50 },
    ],
  },
  {
    slug: "sound-orbit-max",
    name: "Sound Orbit Max Speaker",
    sku: "CE-AU-004",
    description:
      "Large-room speaker with spatial audio calibration and Wi-Fi multiroom.",
    priceLKR: 34900,
    compareAtLKR: 39900,
    stock: 80,
    categories: ["audio"],
    images: [{ url: placeholderImage("sound-orbit-max", 1) }],
  },
  {
    slug: "karaoke-lite",
    name: "Karaoke Lite Wireless Set",
    sku: "CE-AU-005",
    description:
      "Dual wireless microphones with rechargeable dock for karaoke nights.",
    priceLKR: 28900,
    compareAtLKR: 31900,
    stock: 65,
    categories: ["audio", "lifestyle"],
    images: [{ url: placeholderImage("karaoke-lite", 1) }],
  },
  {
    slug: "guardian-cam",
    name: "Guardian Cam 2K",
    sku: "CE-SH-006",
    description:
      "Indoor smart camera with auto-tracking, night vision, and HomeKit support.",
    priceLKR: 21900,
    compareAtLKR: 23900,
    stock: 140,
    categories: ["smart-home"],
    images: [{ url: placeholderImage("guardian-cam", 1) }],
  },
  {
    slug: "corn-smart-plug",
    name: "Corn Smart Plug Duo",
    sku: "CE-SH-007",
    description:
      "Wi-Fi smart plug pack with energy monitoring and Corn Automations integration.",
    priceLKR: 9900,
    compareAtLKR: 11900,
    stock: 320,
    categories: ["smart-home"],
    images: [{ url: placeholderImage("corn-smart-plug", 1) }],
  },
  {
    slug: "lumen-led-strip",
    name: "Lumen Sync LED Strip",
    sku: "CE-SH-008",
    description:
      "4m addressable LED kit that syncs with music and voice assistants.",
    priceLKR: 15900,
    compareAtLKR: 18900,
    stock: 150,
    categories: ["smart-home", "lifestyle"],
    images: [{ url: placeholderImage("lumen-led-strip", 1) }],
  },
  {
    slug: "airclean-mini",
    name: "AirClean Mini Purifier",
    sku: "CE-LS-009",
    description:
      "Desk-friendly HEPA purifier with Corn Health insights and quiet mode.",
    priceLKR: 27900,
    compareAtLKR: 30900,
    stock: 90,
    categories: ["lifestyle"],
    images: [{ url: placeholderImage("airclean-mini", 1) }],
  },
  {
    slug: "corn-watch-neo",
    name: "Corn Watch Neo",
    sku: "CE-WR-010",
    description:
      "Aluminum smartwatch with 7-day battery, AMOLED display, and Corn Health.",
    priceLKR: 49900,
    compareAtLKR: 54900,
    stock: 220,
    categories: ["wearables"],
    images: [{ url: placeholderImage("corn-watch-neo", 1) }],
    variants: [
      { name: "Graphite 42mm", sku: "CE-WR-010-G42", priceLKR: 49900, stock: 120 },
      { name: "Silver 46mm", sku: "CE-WR-010-S46", priceLKR: 52900, stock: 100 },
    ],
  },
  {
    slug: "corn-watch-pro",
    name: "Corn Watch Pro LTE",
    sku: "CE-WR-011",
    description:
      "Flagship LTE smartwatch with sapphire glass and on-device AI coach.",
    priceLKR: 74900,
    compareAtLKR: 79900,
    stock: 110,
    categories: ["wearables"],
    images: [{ url: placeholderImage("corn-watch-pro", 1) }],
  },
  {
    slug: "active-buds-pro",
    name: "Active Buds Pro",
    sku: "CE-AU-012",
    description:
      "Flagship ANC earbuds with adaptive EQ and dual-device pairing.",
    priceLKR: 28900,
    compareAtLKR: 31900,
    stock: 260,
    categories: ["audio", "wearables"],
    images: [{ url: placeholderImage("active-buds-pro", 1) }],
  },
  {
    slug: "pulse-fit-band",
    name: "Pulse Fit Band",
    sku: "CE-WR-013",
    description:
      "Lightweight fitness tracker with stress tracking and Corn Rewards integration.",
    priceLKR: 14900,
    compareAtLKR: 16900,
    stock: 350,
    categories: ["wearables", "lifestyle"],
    images: [{ url: placeholderImage("pulse-fit-band", 1) }],
  },
  {
    slug: "corn-bike-mount",
    name: "Corn Bike Phone Mount",
    sku: "CE-LS-014",
    description:
      "Shock-absorbing aluminum mount compatible with most e-bikes and scooters.",
    priceLKR: 6900,
    stock: 210,
    categories: ["lifestyle"],
    images: [{ url: placeholderImage("corn-bike-mount", 1) }],
  },
  {
    slug: "vision-smart-glasses",
    name: "Vision Smart Glasses",
    sku: "CE-WR-015",
    description:
      "Audio-enabled glasses with open-ear speakers and voice assistant access.",
    priceLKR: 39900,
    stock: 75,
    categories: ["wearables", "lifestyle"],
    images: [{ url: placeholderImage("vision-smart-glasses", 1) }],
  },
  {
    slug: "studio-mic-usb",
    name: "Studio Mic USB-C",
    sku: "CE-AU-016",
    description:
      "Broadcast-quality condenser mic with dual pickup patterns and mute tap.",
    priceLKR: 24900,
    stock: 130,
    categories: ["audio"],
    images: [{ url: placeholderImage("studio-mic-usb", 1) }],
  },
  {
    slug: "travel-power-bank",
    name: "Travel Power Bank 20K",
    sku: "CE-CH-017",
    description:
      "20000mAh power bank with airline-approved design and fast charging.",
    priceLKR: 19900,
    compareAtLKR: 21900,
    stock: 300,
    categories: ["chargers", "lifestyle"],
    images: [{ url: placeholderImage("travel-power-bank", 1) }],
  },
  {
    slug: "dual-coil-pad",
    name: "Dual Coil Wireless Pad",
    sku: "CE-CH-018",
    description:
      "15W MagSafe-compatible pad with watch puck and Corn NightStand mode.",
    priceLKR: 17900,
    stock: 260,
    categories: ["chargers"],
    images: [{ url: placeholderImage("dual-coil-pad", 1) }],
  },
  {
    slug: "corn-tab-stand",
    name: "Corn Adjustable Tablet Stand",
    sku: "CE-LS-019",
    description:
      "Stable fold-flat stand for tablets and portable monitors with cable routing.",
    priceLKR: 8900,
    stock: 190,
    categories: ["lifestyle"],
    images: [{ url: placeholderImage("corn-tab-stand", 1) }],
  },
  {
    slug: "zen-desk-lamp",
    name: "Zen Desk Lamp",
    sku: "CE-LS-020",
    description:
      "Minimal lamp with ambient sensors, Qi charger, and Corn Focus modes.",
    priceLKR: 22900,
    stock: 160,
    categories: ["smart-home", "lifestyle"],
    images: [{ url: placeholderImage("zen-desk-lamp", 1) }],
  },
];

const shippingZoneSeeds = [
  {
    name: "Colombo / Gampaha",
    districts: ["Colombo", "Gampaha"],
    rates: [
      { label: "Standard Delivery (Metro)", priceLKR: 450, minSubtotalLKR: 0 },
      { label: "Standard Delivery (Metro) - Free", priceLKR: 0, minSubtotalLKR: 10000 },
    ],
  },
  {
    name: "Outstation",
    districts: [
      "Anuradhapura",
      "Badulla",
      "Batticaloa",
      "Galle",
      "Hambantota",
      "Jaffna",
      "Kandy",
      "Kegalle",
      "Kilinochchi",
      "Kurunegala",
      "Mannar",
      "Matale",
      "Matara",
      "Monaragala",
      "Mullaitivu",
      "Nuwara Eliya",
      "Polonnaruwa",
      "Puttalam",
      "Ratnapura",
      "Trincomalee",
      "Vavuniya",
    ],
    rates: [
      { label: "Standard Delivery (Outstation)", priceLKR: 650, minSubtotalLKR: 0 },
      {
        label: "Standard Delivery (Outstation) - Free",
        priceLKR: 0,
        minSubtotalLKR: 15000,
      },
    ],
  },
];

async function resetCatalog() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite?.deleteMany?.();
  await prisma.productOnCategory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.shippingZone.deleteMany();
}

async function seedCategories() {
  for (const category of categorySeeds) {
    await prisma.category.create({ data: category });
  }
}

async function seedProducts() {
  for (const product of productSeeds) {
    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        description: product.description,
        priceLKR: product.priceLKR,
        compareAtLKR: product.compareAtLKR ?? null,
        stock: product.stock,
        images: {
          create: product.images.map((image, index) => ({
            url: image.url,
            alt: image.alt ?? product.name,
            position: index,
          })),
        },
        variants: product.variants?.length
          ? {
              create: product.variants.map((variant) => ({
                name: variant.name,
                sku: variant.sku,
                priceLKR: variant.priceLKR,
                stock: variant.stock,
              })),
            }
          : undefined,
        categories: {
          create: (product.categories ?? []).map((slug) => ({
            category: {
              connect: { slug },
            },
          })),
        },
      },
    });
  }
}

async function main() {
  console.log("Seeding catalog data...");
  await resetCatalog();
  await seedCategories();
  await seedProducts();
  console.log("Seeding shipping zones...");
  for (const zone of shippingZoneSeeds) {
    await prisma.shippingZone.create({
      data: {
        name: zone.name,
        districts: zone.districts,
        rates: {
          create: zone.rates.map((rate) => ({
            label: rate.label,
            priceLKR: rate.priceLKR,
            minSubtotalLKR: rate.minSubtotalLKR,
          })),
        },
      },
    });
  }
  console.log(
    `Seeded ${categorySeeds.length} categories, ${productSeeds.length} products, and ${shippingZoneSeeds.length} shipping zones.`,
  );
}

main()
  .catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
