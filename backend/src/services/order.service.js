const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");

const VALID_PAYMENT_METHODS = ["COD", "PAYHERE"];
const ORDER_INCLUDE = {
  items: true,
  shippingAddr: true,
  billingAddr: true,
};

const CART_ITEM_INCLUDE = {
  product: {
    select: {
      id: true,
      name: true,
      sku: true,
      priceLKR: true,
      stock: true,
      active: true,
    },
  },
  variant: {
    select: {
      id: true,
      name: true,
      sku: true,
      priceLKR: true,
      stock: true,
    },
  },
};

const formatOrderNo = () =>
  `CN-${Math.floor(Date.now() / 1000).toString(36).toUpperCase()}`;

const loadCart = async (cartId, userId) => {
  if (!cartId) throw createHttpError(400, "Cart is required.");

  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      OR: [{ userId }, { userId: null }],
    },
    include: {
      items: {
        include: CART_ITEM_INCLUDE,
      },
    },
  });

  if (!cart) throw createHttpError(404, "Cart not found.");
  if (!cart.items.length) throw createHttpError(400, "Cart is empty");
  return cart;
};

const loadAddress = async (addressId, userId, label) => {
  if (!addressId) {
    throw createHttpError(400, `${label} address is required.`);
  }
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw createHttpError(404, `${label} address not found.`);
  if (!address.district?.trim()) {
    throw createHttpError(400, "Address district is required for shipping.");
  }
  return address;
};

const createOrderFromQuote = async ({
  quote,
  userId,
  paymentMethod,
  idempotencyKey,
  markPaid,
  payhereReference,
  payherePaymentId,
  rawPaymentPayload,
}) => {
  if (idempotencyKey) {
    const existing = await prisma.order.findUnique({
      where: { idempotencyKey },
      select: { id: true, orderNo: true, totalLKR: true },
    });
    if (existing) {
      return existing;
    }
  }

  const { cart, items, shippingAddress, billingAddress, totals } = quote;

  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      if (item.variantId) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.qty } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }
    }

    const timelineEntries = [
      {
        type: "ORDER_PLACED",
        note: `Order created with ${paymentMethod}`,
      },
    ];

    if (markPaid) {
      timelineEntries.push({
        type: "PAYMENT_CAPTURED",
        note: "Payment confirmed via PayHere.",
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        orderNo: formatOrderNo(),
        idempotencyKey: idempotencyKey || null,
        userId,
        status: markPaid ? "PAID" : "PENDING",
        paymentMethod,
        paymentStatus: markPaid ? "PAID" : "UNPAID",
        shippingAddrId: shippingAddress.id,
        billingAddrId: billingAddress.id,
        subTotalLKR: totals.subTotalLKR,
        shippingLKR: totals.shippingLKR,
        discountLKR: totals.discountLKR,
        totalLKR: totals.totalLKR,
        payhereRef: payhereReference || null,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            sku: item.sku,
            qty: item.qty,
            unitLKR: item.price,
            lineTotalLKR: item.lineTotalLKR,
          })),
        },
        timeline: {
          create: timelineEntries,
        },
      },
      select: {
        id: true,
        orderNo: true,
        totalLKR: true,
      },
    });

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        method: paymentMethod,
        status: markPaid ? "PAID" : "UNPAID",
        amountLKR: totals.totalLKR,
        providerRef: payherePaymentId || payhereReference || null,
        rawPayload: rawPaymentPayload || null,
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return order;
};

const pickShippingRate = (rates, subtotal) => {
  const eligible = rates
    .filter((item) => item.minSubtotalLKR <= subtotal)
    .sort((a, b) => b.minSubtotalLKR - a.minSubtotalLKR);
  if (!eligible.length) {
    return null;
  }
  return eligible.find((item) => item.priceLKR > 0) ?? eligible[0];
};

const resolveShippingRate = async (district, subtotal) => {
  const zone = await prisma.shippingZone.findFirst({
    where: { districts: { has: district } },
    include: { rates: true },
  });
  if (!zone) {
    throw createHttpError(400, "Shipping not available for this district.");
  }
  const rate = pickShippingRate(zone.rates, subtotal);
  if (!rate) {
    throw createHttpError(400, "No shipping rate available for this subtotal.");
  }
  return rate;
};

const repriceCartItems = (cart) => {
  let subTotalLKR = 0;
  const items = cart.items.map((item) => {
    const price = item.variant?.priceLKR ?? item.product.priceLKR;
    const name = item.variant?.name ?? item.product.name;
    const sku = item.variant?.sku ?? item.product.sku;
    const availableStock = item.variant?.stock ?? item.product.stock;

    if (availableStock < item.qty) {
      throw createHttpError(
        409,
        `Only ${availableStock} unit(s) available for ${name}.`,
      );
    }

    const lineTotalLKR = price * item.qty;
    subTotalLKR += lineTotalLKR;

    return {
      ...item,
      price,
      name,
      sku,
      availableStock,
      lineTotalLKR,
    };
  });
  return { items, subTotalLKR };
};

const buildOrderQuote = async ({
  cartId,
  userId,
  shippingAddressId,
  billingAddressId,
}) => {
  const cart = await loadCart(cartId, userId);
  const { items, subTotalLKR } = repriceCartItems(cart);

  const shippingAddress = await loadAddress(
    shippingAddressId,
    userId,
    "Shipping",
  );
  const billingAddress = await loadAddress(
    billingAddressId || shippingAddressId,
    userId,
    "Billing",
  );

  const shippingRate = await resolveShippingRate(
    shippingAddress.district,
    subTotalLKR,
  );

  const discountLKR = 0;
  const shippingLKR = shippingRate.priceLKR;
  const totalLKR = subTotalLKR + shippingLKR - discountLKR;

  return {
    cart,
    items,
    shippingAddress,
    billingAddress,
    shippingRate,
    totals: {
      subTotalLKR,
      shippingLKR,
      discountLKR,
      totalLKR,
    },
  };
};

const placeOrder = async ({
  userId,
  shippingAddressId,
  billingAddressId,
  paymentMethod,
  idempotencyKey,
  cartId,
}) => {
  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw createHttpError(400, "Invalid payment method.");
  }

  if (paymentMethod === "PAYHERE") {
    throw createHttpError(
      400,
      "Use the PayHere checkout flow to initiate online payments.",
    );
  }

  const quote = await buildOrderQuote({
    cartId,
    userId,
    shippingAddressId,
    billingAddressId,
  });

  return createOrderFromQuote({
    quote,
    userId,
    paymentMethod,
    idempotencyKey,
    markPaid: false,
  });
};

const createOrderAfterPayherePayment = async ({
  payhereOrderId,
  payherePaymentId,
  userId,
  cartId,
  shippingAddressId,
  billingAddressId,
  rawPayload,
}) => {
  const payhereReference = payherePaymentId || payhereOrderId;

  const existing = await prisma.order.findFirst({
    where: {
      OR: [
        { idempotencyKey: payhereOrderId },
        { payhereRef: payhereReference },
      ],
    },
    select: { id: true, orderNo: true, totalLKR: true },
  });

  if (existing) {
    return existing;
  }

  const quote = await buildOrderQuote({
    cartId,
    userId,
    shippingAddressId,
    billingAddressId,
  });

  return createOrderFromQuote({
    quote,
    userId,
    paymentMethod: "PAYHERE",
    idempotencyKey: payhereOrderId,
    markPaid: true,
    payhereReference,
    payherePaymentId,
    rawPaymentPayload: rawPayload,
  });
};

module.exports = {
  buildOrderQuote,
  placeOrder,
  createOrderAfterPayherePayment,
  listOrdersForUser: async (userId) =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: ORDER_INCLUDE,
    }),
  getOrderById: async ({ orderId, userId, isAdmin }) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    });
    if (!order) throw createHttpError(404, "Order not found.");
    if (!isAdmin && order.userId !== userId) {
      throw createHttpError(403, "Forbidden");
    }
    return order;
  },
};
