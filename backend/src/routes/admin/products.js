const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");
const {
  listProducts,
  createProduct,
  updateProduct,
  addProductImage,
} = require("../../services/admin.service");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN", "STAFF")];

router.use(...adminsOnly);

router.get("/", async (req, res, next) => {
  try {
    const payload = await listProducts({
      q: req.query.q,
      page: req.query.page,
      limit: req.query.limit,
    });
    return respond.success(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = await createProduct({
      payload: req.body || {},
      actor: req.user,
    });
    return respond.success(res, { product }, 201);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const product = await updateProduct({
      id: req.params.id?.trim(),
      payload: req.body || {},
      actor: req.user,
    });
    return respond.success(res, { product });
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/images", async (req, res, next) => {
  try {
    const image = await addProductImage({
      productId: req.params.id?.trim(),
      payload: req.body || {},
      actor: req.user,
    });
    return respond.success(res, { image }, 201);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
