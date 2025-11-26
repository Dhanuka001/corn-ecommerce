const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");
const {
  listOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaid,
} = require("../../services/admin.service");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN", "STAFF")];

router.use(...adminsOnly);

router.get("/", async (req, res, next) => {
  try {
    const payload = await listOrders({
      status: req.query.status,
      q: req.query.q,
      page: req.query.page,
      limit: req.query.limit,
    });
    return respond.success(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrderById({ orderId: req.params.id?.trim() });
    return respond.success(res, { order });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const status =
      typeof req.body?.status === "string"
        ? req.body.status.toUpperCase().trim()
        : "";
    const order = await updateOrderStatus({
      orderId: req.params.id?.trim(),
      status,
      actor: req.user,
    });
    return respond.success(res, { order });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/mark-paid", async (req, res, next) => {
  try {
    const order = await markOrderPaid({
      orderId: req.params.id?.trim(),
      actor: req.user,
    });
    return respond.success(res, { order });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
