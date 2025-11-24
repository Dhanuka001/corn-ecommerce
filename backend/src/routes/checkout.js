const { Router } = require("express");
const respond = require("../lib/respond");
const { requireAuth } = require("../middleware/auth");
const { getCheckoutSummary } = require("../services/checkout.service");

const router = Router();

router.post("/summary", requireAuth, async (req, res, next) => {
  try {
    const { cartId, shippingAddressId } = req.body || {};
    const summary = await getCheckoutSummary({
      cartId: cartId?.trim(),
      addressId: shippingAddressId?.trim(),
      userId: req.user.userId,
    });
    return respond.success(res, summary);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
