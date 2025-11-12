const prisma = require("../src/lib/prisma");

async function main() {
  console.log("Seed script placeholder - no records created.");
}

main()
  .catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
