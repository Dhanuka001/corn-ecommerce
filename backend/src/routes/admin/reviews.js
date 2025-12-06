const { Router } = require("express");
const respond = require("../../lib/respond");
const reviewService = require("../../services/review.service");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();

router.use(requireAuth);
router.use(requireRole("ADMIN", "STAFF"));

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 100);
    const productId = req.query.productId;
    const data = await reviewService.listReviewsForAdmin({ productId, page, limit });
    return respond.success(res, {
      data: data.reviews,
      meta: {
        total: data.total,
        page,
        limit,
        pages: Math.max(Math.ceil(data.total / limit), 1),
      },
    });
  } catch (error) {
    console.error("Admin reviews list error:", error);
    return respond.error(res, 500, "Unable to load reviews.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    return respond.success(res, { ok: true });
  } catch (error) {
    console.error("Delete review error:", error);
    return respond.error(res, 500, "Unable to delete review.");
  }
});

module.exports = router;
