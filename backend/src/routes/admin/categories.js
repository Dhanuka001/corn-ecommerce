const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");
const {
  listCategories,
  createCategory,
  updateCategory,
} = require("../../services/admin.service");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN", "STAFF")];

router.use(...adminsOnly);

router.get("/", async (_req, res, next) => {
  try {
    const categories = await listCategories();
    return respond.success(res, { categories });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const category = await createCategory({
      payload: req.body || {},
      actor: req.user,
    });
    return respond.success(res, { category }, 201);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const category = await updateCategory({
      id: req.params.id?.trim(),
      payload: req.body || {},
      actor: req.user,
    });
    return respond.success(res, { category });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
