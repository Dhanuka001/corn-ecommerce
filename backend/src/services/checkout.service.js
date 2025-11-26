const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");

const CART_WITH_ITEMS = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          priceLKR: true,
          stock: true,
        },
      },
      variant: {
        select: {
          id: true,
          priceLKR: true,
          stock: true,
        },
      },
    },
  },
};

const computeSubtotal = (cart) =>
  cart.items.reduce((sum, item) => sum + item.unitLKR * item.qty, 0);

const loadCart = async ({ cartId, userId }) => {
  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      OR: [{ userId }, { userId: null }],
    },
    include: CART_WITH_ITEMS,
  });
  if (!cart) {
    throw createHttpError(404, "Cart not found.");
  }
  return cart;
};

const loadAddress = async ({ addressId, userId }) => {
  if (!addressId) {
    throw createHttpError(400, "shippingAddressId is required.");
  }
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    throw createHttpError(404, "Address not found.");
  }
  if (!address.district?.trim()) {
    throw createHttpError(400, "Address district is required for shipping.");
  }
  return address;
};

const resolveShippingRate = async (district, subtotal) => {
  const zone = await prisma.shippingZone.findFirst({
    where: {
      districts: {
        has: district,
      },
    },
    include: {
      rates: true,
    },
  });

  if (!zone) {
    throw createHttpError(400, "Shipping not available for this district.");
  }

  const rate = zone.rates
    .filter((item) => item.minSubtotalLKR <= subtotal)
    .sort((a, b) => b.minSubtotalLKR - a.minSubtotalLKR)[0];

  if (!rate) {
    throw createHttpError(400, "No shipping rate available for this subtotal.");
  }

  return rate;
};

const buildSummary = ({ subtotal, shipping, discount, rate }) => ({
  subTotalLKR: subtotal,
  shippingLKR: shipping,
  discountLKR: discount,
  totalLKR: subtotal + shipping - discount,
  shippingRate: {
    id: rate.id,
    label: rate.label,
  },
});

const getCheckoutSummary = async ({ cartId, addressId, userId }) => {
  if (!cartId) {
    throw createHttpError(400, "cartId is required.");
  }

  const cart = await loadCart({ cartId, userId });
  if (!cart.items.length) {
    throw createHttpError(400, "Cart is empty");
  }
  const subtotal = computeSubtotal(cart);
  const address = await loadAddress({ addressId, userId });
  const rate = await resolveShippingRate(address.district, subtotal);

  const discount = 0;
  const shipping = rate.priceLKR;

  return buildSummary({
    subtotal,
    shipping,
    discount,
    rate,
  });
};

module.exports = {
  getCheckoutSummary,
};
