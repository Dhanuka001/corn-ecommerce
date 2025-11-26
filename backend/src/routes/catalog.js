const { Router } = require("express");
const respond = require("../lib/respond");
const catalogService = require("../services/catalog.service");

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

module.exports = router;
