const { Router } = require("express");
const respond = require("../lib/respond");
const {
  getCartIdFromRequest,
  setCartIdCookie,
} = require("../lib/cart-session");
const { getSessionUser } = require("../middleware/auth");
const {
  ensureCart,
  addItem,
  updateItemQuantity,
  removeItem,
} = require("../services/cart.service");

const router = Router();

const resolveCartContext = async (req, res) => {
  const authUser = getSessionUser(req);
  const cookieCartId = getCartIdFromRequest(req);
  const cart = await ensureCart({
    cartId: cookieCartId,
    userId: authUser?.userId,
  });

  if (!cookieCartId || cookieCartId !== cart.id) {
    setCartIdCookie(res, cart.id);
  }

  return { cart, authUser };
};

const sanitizeVariantId = (variantId) => {
  if (!variantId) return null;
  const trimmed = variantId.trim();
  return trimmed.length ? trimmed : null;
};

router.get("/", async (req, res, next) => {
  try {
    const { cart } = await resolveCartContext(req, res);
    return respond.success(res, cart);
  } catch (error) {
    return next(error);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const { cart } = await resolveCartContext(req, res);
    const { productId, variantId, qty } = req.body || {};
    const normalizedProductId = productId?.trim();

    if (!normalizedProductId) {
      return respond.error(res, 400, "productId is required.");
    }

    const nextCart = await addItem({
      cartId: cart.id,
      productId: normalizedProductId,
      variantId: sanitizeVariantId(variantId),
      qty,
    });

    return respond.success(res, nextCart, 201);
  } catch (error) {
    return next(error);
  }
});

router.patch("/items/:itemId", async (req, res, next) => {
  try {
    const { cart } = await resolveCartContext(req, res);
    const { qty } = req.body || {};
    const itemId = req.params.itemId?.trim();

    if (!itemId) {
      return respond.error(res, 400, "itemId is required.");
    }

    const nextCart = await updateItemQuantity({
      cartId: cart.id,
      itemId,
      qty,
    });

    return respond.success(res, nextCart);
  } catch (error) {
    return next(error);
  }
});

router.delete("/items/:itemId", async (req, res, next) => {
  try {
    const { cart } = await resolveCartContext(req, res);
    const itemId = req.params.itemId?.trim();

    if (!itemId) {
      return respond.error(res, 400, "itemId is required.");
    }

    const nextCart = await removeItem({
      cartId: cart.id,
      itemId,
    });

    return respond.success(res, nextCart);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
