const env = require("../config/env");

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const cartCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.isProduction,
  path: "/",
};

const CART_COOKIE_NAME = "corn_cart_id";

const getCartIdFromRequest = (req) => req.cookies?.[CART_COOKIE_NAME] || null;

const setCartIdCookie = (res, cartId) => {
  if (!cartId) return;
  res.cookie(CART_COOKIE_NAME, cartId, {
    ...cartCookieOptions,
    maxAge: THIRTY_DAYS_MS,
  });
};

const clearCartIdCookie = (res) => {
  res.clearCookie(CART_COOKIE_NAME, cartCookieOptions);
};

module.exports = {
  CART_COOKIE_NAME,
  getCartIdFromRequest,
  setCartIdCookie,
  clearCartIdCookie,
};
