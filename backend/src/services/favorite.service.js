const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");

const PRODUCT_SNIPPET = {
  id: true,
  slug: true,
  name: true,
  sku: true,
  priceLKR: true,
  compareAtLKR: true,
  stock: true,
  images: {
    orderBy: { position: "asc" },
    take: 1,
    select: {
      id: true,
      url: true,
      alt: true,
      position: true,
    },
  },
};

const toFavoriteResponse = (favorites = []) =>
  favorites.map((favorite) => ({
    id: favorite.id,
    productId: favorite.productId,
    createdAt: favorite.createdAt,
    product: favorite.product,
  }));

const listFavorites = async (userId) => {
  if (!userId) {
    return [];
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: PRODUCT_SNIPPET },
    },
  });

  return toFavoriteResponse(favorites);
};

const addFavorite = async ({ userId, productId }) => {
  if (!userId) {
    throw createHttpError(401, "Sign in to save favorites.");
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
    select: { id: true },
  });

  if (!product) {
    throw createHttpError(404, "Product not found.");
  }

  await prisma.favorite.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {},
    create: {
      userId,
      productId,
    },
  });

  return listFavorites(userId);
};

const removeFavorite = async ({ userId, productId }) => {
  if (!userId) {
    throw createHttpError(401, "Sign in to manage favorites.");
  }

  await prisma.favorite.deleteMany({
    where: {
      userId,
      productId,
    },
  });

  return listFavorites(userId);
};

module.exports = {
  listFavorites,
  addFavorite,
  removeFavorite,
};
