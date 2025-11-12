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
  const normalize = (value) =>
    typeof value === "string"
      ? value.trim()
      : value !== undefined && value !== null
        ? String(value).trim()
        : undefined;

  try {
    const { q, category, sort, page, limit } = req.query;
    const payload = await catalogService.listProducts({
      q: normalize(q),
      category: normalize(category),
      sort: normalize(sort),
      page: normalize(page),
      limit: normalize(limit),
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
