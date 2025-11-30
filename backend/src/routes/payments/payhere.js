const { Router } = require("express");
const CryptoJS = require("crypto-js");

const respond = require("../../lib/respond");
const env = require("../../config/env");
const prisma = require("../../lib/prisma");
const { requireAuth } = require("../../middleware/auth");
const { ensureCart } = require("../../services/cart.service");
const {
  buildOrderQuote,
  createOrderAfterPayherePayment,
} = require("../../services/order.service");
const { getCartIdFromRequest, setCartIdCookie } = require("../../lib/cart-session");

const router = Router();

const logPayhere = (...args) => console.info("[payhere]", ...args);

const md5Upper = (value) =>
  CryptoJS.MD5(String(value || ""))
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

const getPayhereConfig = async () => {
  const settings = await prisma.storeSetting.findUnique({ where: { id: 1 } });
  const merchantId = settings?.payhereMerchantId || env.payhereMerchantId;
  const merchantSecret =
    settings?.payhereMerchantSecret || env.payhereMerchantSecret;
  const sandbox =
    settings?.payhereSandbox !== undefined
      ? settings.payhereSandbox
      : env.payhereSandbox;

  if (!merchantId || !merchantSecret) {
    throw respond.createHttpError(
      500,
      "PayHere merchant credentials are not configured.",
    );
  }

  return { merchantId, merchantSecret, sandbox };
};

const payhereCheckoutUrl = (sandbox) =>
  sandbox
    ? "https://sandbox.payhere.lk/pay/checkout"
    : "https://www.payhere.lk/pay/checkout";

const formatAmount = (value) => Number(value || 0).toFixed(2);

const generatePayHereHash = (
  merchantId,
  orderId,
  amount,
  currency,
  merchantSecret,
) => {
  const amountFormatted = formatAmount(amount);
  const secretHash = md5Upper(merchantSecret);
  // PayHere requires MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret)) in uppercase
  return md5Upper(`${merchantId}${orderId}${amountFormatted}${currency}${secretHash}`);
};

const validateNotificationSignature = ({ merchantSecret, payload }) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = payload;

  const computed = CryptoJS.MD5(
    `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${md5Upper(
      merchantSecret,
    )}`,
  )
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return computed === (md5sig || "").toUpperCase();
};

const encodeMetadata = (data) =>
  Buffer.from(JSON.stringify(data), "utf8").toString("base64");

const decodeMetadata = (raw) => {
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }
};

router.post("/create-payment", requireAuth, async (req, res, next) => {
  try {
    const { shippingAddressId, billingAddressId } = req.body || {};
    const cookieCartId = getCartIdFromRequest(req);
    const cart = await ensureCart({
      cartId: cookieCartId,
      userId: req.user.userId,
    });

    if (!cookieCartId || cookieCartId !== cart.id) {
      setCartIdCookie(res, cart.id);
    }

    if (!cart.items.length) {
      throw respond.createHttpError(400, "Cart is empty");
    }

    const { merchantId, merchantSecret, sandbox } = await getPayhereConfig();

    const quote = await buildOrderQuote({
      cartId: cart.id,
      userId: req.user.userId,
      shippingAddressId: shippingAddressId?.trim(),
      billingAddressId: billingAddressId?.trim(),
    });

    const payhereOrderId = `PH-${Date.now()}-${cart.id.slice(-4)}${Math.random()
      .toString(36)
      .slice(-4)}`;
    const amount = formatAmount(quote.totals.totalLKR);
    const currency = (env.payhereCurrency || "LKR").toUpperCase();

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });

    const [firstName, ...restName] = (quote.shippingAddress.fullName || "")
      .trim()
      .split(/\s+/);
    const lastName = restName.join(" ");

    const metadata = encodeMetadata({
      cartId: cart.id,
      userId: req.user.userId,
      shippingAddressId: shippingAddressId?.trim(),
      billingAddressId: billingAddressId?.trim() || shippingAddressId?.trim(),
    });

  const payload = {
      merchant_id: merchantId,
      return_url: env.payhereReturnUrl,
      cancel_url: env.payhereCancelUrl,
      notify_url: env.payhereNotifyUrl,
      order_id: payhereOrderId,
      items: `Order for ${quote.items.length} item(s)`,
      amount,
      currency,
      first_name: firstName || user?.firstName || "Customer",
      last_name: lastName || user?.lastName || "Customer",
      email: user?.email || "payments@cornelectronics.com",
      phone: quote.shippingAddress.phone || user?.phone || "",
      address: `${quote.shippingAddress.addressLine1} ${quote.shippingAddress.addressLine2 || ""}`.trim(),
      city: quote.shippingAddress.city || quote.shippingAddress.district,
      country: quote.shippingAddress.country || "LK",
      custom_1: metadata,
      custom_2: quote.shippingRate.label,
    };

    payload.hash = generatePayHereHash(
      merchantId,
      payhereOrderId,
      amount,
      currency,
      merchantSecret,
    );

    logPayhere("create-payment", {
      orderId: payhereOrderId,
      userId: req.user.userId,
      cartId: cart.id,
      amount,
      currency,
      hash: payload.hash,
      sandbox,
    });

    return respond.success(res, {
      redirectUrl: payhereCheckoutUrl(sandbox),
      payload,
      amountLKR: quote.totals.totalLKR,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/notify", async (req, res) => {
  try {
    const notification = req.body || {};
    const statusCode = Number(
      notification.status_code ?? notification.payment_status,
    );

    logPayhere("notify_received", {
      order_id: notification.order_id,
      payment_id: notification.payment_id,
      status_code: statusCode,
      amount: notification.payhere_amount,
      currency: notification.payhere_currency,
    });

    const { merchantId, merchantSecret } = await getPayhereConfig();

    if (notification.merchant_id && notification.merchant_id !== merchantId) {
      throw respond.createHttpError(400, "Merchant ID mismatch.");
    }

    if (!validateNotificationSignature({
      merchantSecret,
      payload: notification,
    })) {
      throw respond.createHttpError(400, "Invalid PayHere signature.");
    }

    if (!Number.isFinite(statusCode)) {
      throw respond.createHttpError(400, "Invalid payment status.");
    }

    if (statusCode !== 2) {
      return respond.success(res, { ok: true, status: statusCode });
    }

    const meta = decodeMetadata(notification.custom_1);
    if (!meta?.cartId || !meta?.userId || !meta?.shippingAddressId) {
      throw respond.createHttpError(400, "Missing payment metadata.");
    }

    const amountPaid = Number(notification.payhere_amount);
    if (!Number.isFinite(amountPaid)) {
      throw respond.createHttpError(400, "Invalid payment amount.");
    }

    const payhereCurrency = (notification.payhere_currency || "").toUpperCase();
    if (
      payhereCurrency &&
      payhereCurrency !== (env.payhereCurrency || "LKR").toUpperCase()
    ) {
      throw respond.createHttpError(400, "Payment currency mismatch.");
    }

    const quote = await buildOrderQuote({
      cartId: meta.cartId,
      userId: meta.userId,
      shippingAddressId: meta.shippingAddressId,
      billingAddressId: meta.billingAddressId || meta.shippingAddressId,
    });

    if (Math.abs(quote.totals.totalLKR - amountPaid) > 0.009) {
      throw respond.createHttpError(400, "Payment amount mismatch.");
    }

    const order = await createOrderAfterPayherePayment({
      payhereOrderId: notification.order_id,
      payherePaymentId: notification.payment_id,
      userId: meta.userId,
      cartId: meta.cartId,
      shippingAddressId: meta.shippingAddressId,
      billingAddressId: meta.billingAddressId || meta.shippingAddressId,
      rawPayload: notification,
    });

    logPayhere("order_created", {
      orderId: order.id,
      orderNo: order.orderNo,
      payhereOrderId: notification.order_id,
      payherePaymentId: notification.payment_id,
    });

    return respond.success(res, {
      ok: true,
      orderId: order.id,
      orderNo: order.orderNo,
    });
  } catch (error) {
    console.error("[payhere] notify error", error);
    const status = error.status || 500;
    return respond.error(
      res,
      status,
      error.message || "Unable to process PayHere notification.",
    );
  }
});

module.exports = router;
