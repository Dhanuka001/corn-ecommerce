const prisma = require("../lib/prisma");
const reviewService = require("./review.service");

// Shared includes ensure FE gets the pieces it needs without multiple round trips.
const BASE_IMAGE_INCLUDE = {
  orderBy: { position: "asc" },
};

const CATEGORY_CHILD_SELECT = {
  id: true,
  slug: true,
  name: true,
  position: true,
};

const PRODUCT_LIST_SELECT = {
  id: true,
  slug: true,
  name: true,
  sku: true,
  priceLKR: true,
  compareAtLKR: true,
  stock: true,
  images: {
    ...BASE_IMAGE_INCLUDE,
    take: 2, // send two thumbnails so FE can build a quick carousel
    select: {
      id: true,
      url: true,
      alt: true,
      position: true,
    },
  },
  categories: {
    select: {
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
};

const PRODUCT_DETAIL_SELECT = {
  id: true,
  slug: true,
  name: true,
  sku: true,
  description: true,
  priceLKR: true,
  compareAtLKR: true,
  stock: true,
  images: {
    ...BASE_IMAGE_INCLUDE,
    select: {
      id: true,
      url: true,
      alt: true,
      position: true,
    },
  },
  variants: {
    orderBy: { priceLKR: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      priceLKR: true,
      stock: true,
    },
  },
  categories: {
    select: {
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
};

const buildSort = (sortKey = "") => {
  switch (sortKey) {
    case "price_asc":
      return { priceLKR: "asc" };
    case "price_desc":
      return { priceLKR: "desc" };
    case "name_asc":
      return { name: "asc" };
    case "name_desc":
      return { name: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
};

// Guardrail for API paging queries so a typo can't nuke the database.
const sanitizePagination = (page = "1", limit = "12") => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 48);
  return { page: parsedPage, limit: parsedLimit, skip: (parsedPage - 1) * parsedLimit };
};

// Minimal tree (root + children) keeps navigation menus lightweight.
const listCategories = async () => {
  const roots = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    select: {
      ...CATEGORY_CHILD_SELECT,
      children: {
        orderBy: { position: "asc" },
        select: CATEGORY_CHILD_SELECT,
      },
    },
  });

  return roots;
};

const listProducts = async ({
  q,
  category,
  categories,
  minPrice,
  maxPrice,
  inStock,
  sort,
  page,
  limit,
}) => {
  const filters = { active: true }; // only expose purchasable SKUs

  if (q) {
    filters.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];
  }

  const categorySlugs = [
    ...(Array.isArray(categories) ? categories : []),
    ...(category ? [category] : []),
  ]
    .map((item) => item?.toString().trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);

  if (categorySlugs.length) {
    filters.categories = {
      some: {
        category: {
          slug: { in: categorySlugs },
        },
      },
    };
  }

  const hasPriceBounds =
    (typeof minPrice === "number" && Number.isFinite(minPrice)) ||
    (typeof maxPrice === "number" && Number.isFinite(maxPrice));

  if (hasPriceBounds) {
    const minBound =
      typeof minPrice === "number" && Number.isFinite(minPrice)
        ? Math.max(0, Math.floor(minPrice))
        : undefined;
    const maxBound =
      typeof maxPrice === "number" && Number.isFinite(maxPrice)
        ? Math.max(0, Math.floor(maxPrice))
        : undefined;

    const [gte, lte] =
      minBound !== undefined && maxBound !== undefined && minBound > maxBound
        ? [maxBound, minBound]
        : [minBound, maxBound];

    filters.priceLKR = {};
    if (gte !== undefined) {
      filters.priceLKR.gte = gte;
    }
    if (lte !== undefined) {
      filters.priceLKR.lte = lte;
    }
  }

  if (inStock === true) {
    filters.stock = { gt: 0 };
  }

  const orderBy = buildSort(sort);
  const pagination = sanitizePagination(page, limit);

  const [rawData, total, priceAgg] = await Promise.all([
    prisma.product.findMany({
      where: filters,
      select: PRODUCT_LIST_SELECT,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
    }),
    prisma.product.count({ where: filters }),
    prisma.product.aggregate({
      where: filters,
      _min: { priceLKR: true },
      _max: { priceLKR: true },
    }),
  ]);

  const data = rawData.map((product) => ({
    ...product,
    categories: product.categories.map(({ category }) => category),
  }));

  return {
    data,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit) || 1,
      priceRange: {
        min: priceAgg._min.priceLKR ?? 0,
        max: priceAgg._max.priceLKR ?? 0,
      },
    },
  };
};

const getProductBySlug = async (slug) => {
  if (!slug) {
    return null;
  }

  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    select: PRODUCT_DETAIL_SELECT,
  });

  if (!product) {
    return null;
  }

  const reviewsResult = await reviewService.listProductReviews({
    productId: product.id,
    limit: 6,
  });

  return {
    ...product,
    categories: product.categories.map(({ category }) => category),
    reviews: reviewsResult.reviews,
    reviewSummary: {
      total: reviewsResult.total,
      averageRating: reviewsResult.averageRating,
    },
  };
};

module.exports = {
  listCategories,
  listProducts,
  getProductBySlug,
};
