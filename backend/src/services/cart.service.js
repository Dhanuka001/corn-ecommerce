const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");

const PRODUCT_SNIPPET = {
  id: true,
  slug: true,
  name: true,
  priceLKR: true,
  compareAtLKR: true,
  stock: true,
  images: {
    orderBy: { position: "asc" },
    take: 1,
    select: {
      id: true,
      url: true,
      alt: true,
      position: true,
    },
  },
};

const VARIANT_SNIPPET = {
  id: true,
  name: true,
  priceLKR: true,
  stock: true,
};

const CART_WITH_ITEMS_INCLUDE = {
  items: {
    orderBy: { createdAt: "asc" },
    include: {
      product: { select: PRODUCT_SNIPPET },
      variant: { select: VARIANT_SNIPPET },
    },
  },
};

const MAX_QTY = 99;

const toCartResponse = (cart) => {
  if (!cart) {
    return null;
  }
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    qty: item.qty,
    unitLKR: item.unitLKR,
    lineTotalLKR: item.unitLKR * item.qty,
    product: item.product,
    variant: item.variant,
  }));

  const subTotalLKR = items.reduce(
    (total, item) => total + item.lineTotalLKR,
    0,
  );
  const totalQuantity = items.reduce((total, item) => total + item.qty, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary: {
      subTotalLKR,
      totalQuantity,
    },
  };
};

const normalizeQty = (qty) => {
  if (qty === undefined || qty === null) return null;
  const parsed = Number.parseInt(qty, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_QTY) {
    return null;
  }
  return parsed;
};

const loadCartWithItems = (tx, cartId) =>
  tx.cart.findUnique({
    where: { id: cartId },
    include: CART_WITH_ITEMS_INCLUDE,
  });

const findCartById = (tx, cartId) => {
  if (!cartId) return Promise.resolve(null);
  return tx.cart.findUnique({
    where: { id: cartId },
    include: CART_WITH_ITEMS_INCLUDE,
  });
};

const findCartByUserId = (tx, userId) => {
  if (!userId) return Promise.resolve(null);
  return tx.cart.findUnique({
    where: { userId },
    include: CART_WITH_ITEMS_INCLUDE,
  });
};

const findCartLine = (tx, { cartId, productId, variantId }) =>
  tx.cartItem.findFirst({
    where: {
      cartId,
      productId,
      variantId: variantId || null,
    },
  });

const loadPricingSnapshot = async (tx, { productId, variantId }) => {
  const product = await tx.product.findFirst({
    where: { id: productId, active: true },
    select: {
      id: true,
      name: true,
      priceLKR: true,
      stock: true,
    },
  });

  if (!product) {
    throw createHttpError(404, "Product not found.");
  }

  if (!variantId) {
    return {
      product,
      variant: null,
      unitPrice: product.priceLKR,
      availableStock: Math.max(product.stock, 0),
    };
  }

  const variant = await tx.variant.findFirst({
    where: { id: variantId, productId: product.id },
    select: {
      id: true,
      name: true,
      priceLKR: true,
      stock: true,
    },
  });

  if (!variant) {
    throw createHttpError(404, "Product variant not found.");
  }

  return {
    product,
    variant,
    unitPrice: variant.priceLKR,
    availableStock: Math.max(variant.stock, 0),
  };
};

const clampQtyToStock = (qty, stock) =>
  Math.max(Math.min(qty, Math.max(stock, 0)), 0);

const mergeCartItems = async (tx, sourceCart, targetCartId) => {
  if (!sourceCart?.items?.length) {
    return;
  }

  for (const item of sourceCart.items) {
    const { unitPrice, availableStock } = await loadPricingSnapshot(tx, {
      productId: item.productId,
      variantId: item.variantId,
    });

    if (availableStock <= 0) {
      continue;
    }

    const existing = await findCartLine(tx, {
      cartId: targetCartId,
      productId: item.productId,
      variantId: item.variantId,
    });

    const desiredQty = (existing?.qty || 0) + item.qty;
    const finalQty = clampQtyToStock(desiredQty, availableStock);

    if (finalQty <= 0) {
      if (existing) {
        await tx.cartItem.delete({ where: { id: existing.id } });
      }
      continue;
    }

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: {
          qty: finalQty,
          unitLKR: unitPrice,
        },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: targetCartId,
          productId: item.productId,
          variantId: item.variantId,
          qty: finalQty,
          unitLKR: unitPrice,
        },
      });
    }
  }
};

const ensureCart = async ({ cartId, userId }) => {
  const cart = await prisma.$transaction(async (tx) => {
    const cookieCart = await findCartById(tx, cartId);
    const userCart = await findCartByUserId(tx, userId);

    if (userId) {
      if (userCart && cookieCart && userCart.id !== cookieCart.id) {
        await mergeCartItems(tx, cookieCart, userCart.id);
        await tx.cart.delete({ where: { id: cookieCart.id } });
        return loadCartWithItems(tx, userCart.id);
      }

      if (userCart) {
        return userCart;
      }

      if (cookieCart) {
        return tx.cart.update({
          where: { id: cookieCart.id },
          data: { userId },
          include: CART_WITH_ITEMS_INCLUDE,
        });
      }

      return tx.cart.create({
        data: { userId },
        include: CART_WITH_ITEMS_INCLUDE,
      });
    }

    if (cookieCart) {
      return cookieCart;
    }

    return tx.cart.create({
      data: {},
      include: CART_WITH_ITEMS_INCLUDE,
    });
  });

  if (!cart) {
    throw createHttpError(500, "Unable to initialize cart.");
  }

  return toCartResponse(cart);
};

const addItem = async ({ cartId, productId, variantId, qty }) => {
  const normalizedQty = normalizeQty(qty);
  if (!normalizedQty) {
    throw createHttpError(
      400,
      `Quantity should be between 1 and ${MAX_QTY}.`,
    );
  }

  const cart = await prisma.$transaction(async (tx) => {
    const cartExists = await tx.cart.findUnique({ where: { id: cartId } });
    if (!cartExists) {
      throw createHttpError(404, "Cart not found.");
    }

    const { unitPrice, availableStock } = await loadPricingSnapshot(tx, {
      productId,
      variantId,
    });

    if (availableStock <= 0) {
      throw createHttpError(400, "Item is currently out of stock.");
    }

    const existing = await findCartLine(tx, { cartId, productId, variantId });
    const nextQty = (existing?.qty || 0) + normalizedQty;

    if (nextQty > availableStock) {
      throw createHttpError(
        400,
        `Only ${availableStock} unit(s) available for this item.`,
      );
    }

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: {
          qty: nextQty,
          unitLKR: unitPrice,
        },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId,
          productId,
          variantId,
          qty: normalizedQty,
          unitLKR: unitPrice,
        },
      });
    }

    return loadCartWithItems(tx, cartId);
  });

  return toCartResponse(cart);
};

const updateItemQuantity = async ({ cartId, itemId, qty }) => {
  const normalizedQty = normalizeQty(qty);
  if (!normalizedQty) {
    throw createHttpError(
      400,
      `Quantity should be between 1 and ${MAX_QTY}.`,
    );
  }

  const cart = await prisma.$transaction(async (tx) => {
    const lineItem = await tx.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: {
          select: {
            id: true,
            stock: true,
          },
        },
        variant: {
          select: {
            id: true,
            stock: true,
          },
        },
      },
    });

    if (!lineItem || lineItem.cartId !== cartId) {
      throw createHttpError(404, "Cart item not found.");
    }

    const availableStock = lineItem.variant
      ? lineItem.variant.stock
      : lineItem.product.stock;

    if (availableStock <= 0) {
      throw createHttpError(400, "Item is currently out of stock.");
    }

    if (normalizedQty > availableStock) {
      throw createHttpError(
        400,
        `Only ${availableStock} unit(s) available for this item.`,
      );
    }

    await tx.cartItem.update({
      where: { id: itemId },
      data: {
        qty: normalizedQty,
      },
    });

    return loadCartWithItems(tx, cartId);
  });

  return toCartResponse(cart);
};

const removeItem = async ({ cartId, itemId }) => {
  const cart = await prisma.$transaction(async (tx) => {
    const lineItem = await tx.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!lineItem || lineItem.cartId !== cartId) {
      throw createHttpError(404, "Cart item not found.");
    }

    await tx.cartItem.delete({ where: { id: itemId } });
    return loadCartWithItems(tx, cartId);
  });

  return toCartResponse(cart);
};

module.exports = {
  ensureCart,
  addItem,
  updateItemQuantity,
  removeItem,
};
