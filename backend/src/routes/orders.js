const { Router } = require("express");
const respond = require("../lib/respond");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listOrdersForUser,
  getOrderById,
} = require("../services/order.service");

const router = Router();

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const orders = await listOrdersForUser(req.user.userId);
    return respond.success(res, { orders });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const order = await getOrderById({
      orderId: req.params.id?.trim(),
      userId: req.user.userId,
      isAdmin: req.user.role === "ADMIN",
    });
    return respond.success(res, { order });
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/cancel", requireAuth, async (req, res, next) => {
  return respond.error(res, 501, "Order cancellation is handled offline.");
});

module.exports = router;
