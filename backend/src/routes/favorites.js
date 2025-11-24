const { Router } = require("express");
const respond = require("../lib/respond");
const { requireAuth } = require("../middleware/auth");
const {
  listFavorites,
  addFavorite,
  removeFavorite,
} = require("../services/favorite.service");

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await listFavorites(req.user.userId);
    return respond.success(res, { items });
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.body || {};
    if (!productId?.trim()) {
      return respond.error(res, 400, "productId is required.");
    }

    const items = await addFavorite({
      userId: req.user.userId,
      productId: productId.trim(),
    });

    return respond.success(res, { items }, 201);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:productId", requireAuth, async (req, res, next) => {
  try {
    const productId = req.params.productId?.trim();
    if (!productId) {
      return respond.error(res, 400, "productId is required.");
    }

    const items = await removeFavorite({
      userId: req.user.userId,
      productId,
    });

    return respond.success(res, { items });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
