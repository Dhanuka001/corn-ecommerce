const { Router } = require("express");
const respond = require("../lib/respond");
const catalogService = require("../services/catalog.service");
const reviewService = require("../services/review.service");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// GET /categories
router.get("/categories", async (_req, res) => {
  try {
    const categories = await catalogService.listCategories();
    return respond.success(res, { categories });
  } catch (error) {
    console.error("List categories error:", error);
    return respond.error(res, 500, "Unable to load categories.");
  }
});

// GET /products?q=&category=&sort=&page=&limit=
router.get("/products", async (req, res) => {
  const normalizeString = (value) =>
    typeof value === "string"
      ? value.trim()
      : value !== undefined && value !== null
        ? String(value).trim()
        : undefined;

  const normalizeNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  };

  const normalizeBool = (value) => {
    if (value === undefined || value === null) return undefined;
    if (value === true || value === "true" || value === "1") return true;
    if (value === false || value === "false" || value === "0") return false;
    return undefined;
  };

  const normalizeArrayParam = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => normalizeString(item)).filter(Boolean);
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  try {
    const { q, category, categories, sort, page, limit, minPrice, maxPrice, inStock } = req.query;
    const categoryList = normalizeArrayParam(categories || category);
    const payload = await catalogService.listProducts({
      q: normalizeString(q),
      category: categoryList[0] || normalizeString(category),
      categories: categoryList,
      minPrice: normalizeNumber(minPrice),
      maxPrice: normalizeNumber(maxPrice),
      inStock: normalizeBool(inStock),
      sort: normalizeString(sort),
      page: normalizeString(page),
      limit: normalizeString(limit),
    });
    return respond.success(res, payload);
  } catch (error) {
    console.error("List products error:", error);
    return respond.error(res, 500, "Unable to load products.");
  }
});

// GET /products/:slug
router.get("/products/:slug", async (req, res) => {
  try {
    const product = await catalogService.getProductBySlug(
      req.params.slug?.trim(),
    );

    if (!product) {
      return respond.error(res, 404, "Product not found.");
    }

    return respond.success(res, { product });
  } catch (error) {
    console.error("Product detail error:", error);
    return respond.error(res, 500, "Unable to load product.");
  }
});

router.get("/products/:slug/reviews", async (req, res) => {
  try {
    const slug = req.params.slug?.trim();
    if (!slug) {
      return respond.error(res, 400, "Product slug is required.");
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return respond.error(res, 404, "Product not found.");
    }

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 24);
    const reviewsResult = await reviewService.listProductReviews({
      productId: product.id,
      page,
      limit,
    });

    return respond.success(res, {
      reviews: reviewsResult.reviews,
      total: reviewsResult.total,
      averageRating: reviewsResult.averageRating,
    });
  } catch (error) {
    console.error("List reviews error:", error);
    return respond.error(res, 500, "Unable to load reviews.");
  }
});

router.post("/products/:slug/reviews", requireAuth, async (req, res) => {
  try {
    const slug = req.params.slug?.trim();
    if (!slug) {
      throw respond.createHttpError(400, "Product slug is required.");
    }
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      throw respond.createHttpError(404, "Product not found.");
    }

    const { rating, title, body, images } = req.body || {};

    const review = await reviewService.createReview({
      userId: req.user.userId,
      productId: product.id,
      rating,
      title,
      body,
      images,
    });

    return respond.success(res, { review });
  } catch (error) {
    if (error.code === "P2002") {
      return respond.error(res, 409, "You already reviewed this product.");
    }
    if (error.status) {
      return respond.error(res, error.status, error.message);
    }
    console.error("Create review error:", error);
    return respond.error(res, 500, "Unable to submit review.");
  }
});

router.get("/reviews/latest", async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 4, 1), 12);
    const reviews = await reviewService.listLatestReviews({ limit });
    return respond.success(res, { reviews });
  } catch (error) {
    console.error("Latest reviews error:", error);
    return respond.error(res, 500, "Unable to load reviews.");
  }
});

module.exports = router;
