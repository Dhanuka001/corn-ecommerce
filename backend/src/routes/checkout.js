const { Router } = require("express");
const respond = require("../lib/respond");
const { requireAuth } = require("../middleware/auth");
const { getCheckoutSummary } = require("../services/checkout.service");
const { placeOrder } = require("../services/order.service");
const {
  getCartIdFromRequest,
  setCartIdCookie,
} = require("../lib/cart-session");
const { ensureCart } = require("../services/cart.service");

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

router.post("/place-order", requireAuth, async (req, res, next) => {
  try {
    const cookieCartId = getCartIdFromRequest(req);
    const cart = await ensureCart({
      cartId: cookieCartId,
      userId: req.user.userId,
    });
    if (!cookieCartId || cookieCartId !== cart.id) {
      setCartIdCookie(res, cart.id);
    }

    const idempotencyKey =
      req.header("Idempotency-Key")?.trim() ||
      req.header("Idempotency-key")?.trim() ||
      null;
    const { shippingAddressId, billingAddressId, paymentMethod } =
      req.body || {};
    const result = await placeOrder({
      userId: req.user.userId,
      shippingAddressId: shippingAddressId?.trim(),
      billingAddressId: billingAddressId?.trim() || shippingAddressId?.trim(),
      paymentMethod: paymentMethod?.trim(),
      idempotencyKey,
      cartId: cart.id,
    });
    return respond.success(res, result, 201);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
