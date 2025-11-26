const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");
const { recordAudit } = require("./audit.service");

const sanitizePagination = (page = 1, limit = 20, maxLimit = 100) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), maxLimit);
  return { page: parsedPage, limit: parsedLimit, skip: (parsedPage - 1) * parsedLimit };
};

const slugify = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";

const ensureUniqueSlug = async (baseSlug, excludeId) => {
  let slug = baseSlug;
  let attempt = 1;
  // Keep generating suffixes until we find a free slug.
  // In practice this will run only a handful of times.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return slug;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }
};

const PRODUCT_SELECT = {
  id: true,
  slug: true,
  name: true,
  sku: true,
  description: true,
  priceLKR: true,
  compareAtLKR: true,
  stock: true,
  active: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: { position: "asc" },
    select: { id: true, url: true, alt: true, position: true },
  },
  categories: {
    select: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
};

const CATEGORY_SELECT = {
  id: true,
  slug: true,
  name: true,
  parentId: true,
  position: true,
  createdAt: true,
  updatedAt: true,
};

const ORDER_SUMMARY_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  items: {
    select: {
      id: true,
      name: true,
      sku: true,
      qty: true,
      unitLKR: true,
      lineTotalLKR: true,
    },
  },
  shippingAddr: true,
  billingAddr: true,
  timeline: {
    orderBy: { createdAt: "asc" },
  },
};

const ALLOWED_STATUSES = ["PENDING", "PAID", "CANCELLED", "FULFILLED", "REFUNDED"];
const ALLOWED_STATUS_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED", "FULFILLED"],
  PAID: ["FULFILLED", "CANCELLED", "REFUNDED"],
  FULFILLED: ["REFUNDED"],
  REFUNDED: [],
  CANCELLED: [],
};

const formatProductResponse = (product) => ({
  ...product,
  categories: product.categories.map(({ category }) => category),
});

const listProducts = async ({ q, page, limit }) => {
  const filters = {};
  if (q?.trim()) {
    filters.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  const pagination = sanitizePagination(page, limit);

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.limit,
      select: PRODUCT_SELECT,
    }),
    prisma.product.count({ where: filters }),
  ]);

  return {
    data: data.map(formatProductResponse),
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit) || 1,
    },
  };
};

const createProduct = async ({ payload, actor }) => {
  const { name, sku, priceLKR, stock = 0, description, compareAtLKR, categoryIds } =
    payload || {};

  if (!name?.trim() || !sku?.trim()) {
    throw createHttpError(400, "name and sku are required.");
  }
  if (!Number.isFinite(Number(priceLKR)) || Number(priceLKR) <= 0) {
    throw createHttpError(400, "priceLKR must be greater than 0.");
  }
  if (!Number.isFinite(Number(stock)) || Number(stock) < 0) {
    throw createHttpError(400, "stock must be zero or greater.");
  }

  const normalizedSku = sku.trim();
  const existingSku = await prisma.product.findUnique({
    where: { sku: normalizedSku },
    select: { id: true },
  });
  if (existingSku) {
    throw createHttpError(409, "SKU already exists.");
  }

  const slugBase = slugify(name);
  const slug = await ensureUniqueSlug(slugBase);

  const product = await prisma.product.create({
    data: {
      slug,
      name: name.trim(),
      sku: normalizedSku,
      priceLKR: Math.round(Number(priceLKR)),
      stock: Math.round(Number(stock)),
      compareAtLKR: compareAtLKR ? Math.round(Number(compareAtLKR)) : null,
      description: description?.trim() || null,
      categories: Array.isArray(categoryIds)
        ? {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          }
        : undefined,
    },
    select: PRODUCT_SELECT,
  });

  await recordAudit({
    userId: actor?.userId,
    route: "/admin/products",
    method: "POST",
    action: "PRODUCT_CREATED",
    before: null,
    after: product,
  });

  return formatProductResponse(product);
};

const updateProduct = async ({ id, payload, actor }) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: PRODUCT_SELECT,
  });
  if (!product) {
    throw createHttpError(404, "Product not found.");
  }

  const updates = {};
  if (payload.name?.trim() && payload.name.trim() !== product.name) {
    updates.name = payload.name.trim();
    updates.slug = await ensureUniqueSlug(slugify(payload.name.trim()), id);
  }
  if (payload.sku?.trim() && payload.sku.trim() !== product.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: payload.sku.trim() },
      select: { id: true },
    });
    if (existingSku && existingSku.id !== id) {
      throw createHttpError(409, "SKU already exists.");
    }
    updates.sku = payload.sku.trim();
  }
  if (payload.description !== undefined) {
    updates.description = payload.description?.trim() || null;
  }
  if (payload.priceLKR !== undefined) {
    const price = Math.round(Number(payload.priceLKR));
    if (!Number.isFinite(price) || price <= 0) {
      throw createHttpError(400, "priceLKR must be greater than 0.");
    }
    updates.priceLKR = price;
  }
  if (payload.compareAtLKR !== undefined) {
    const compare = payload.compareAtLKR
      ? Math.round(Number(payload.compareAtLKR))
      : null;
    if (compare !== null && (!Number.isFinite(compare) || compare <= 0)) {
      throw createHttpError(400, "compareAtLKR must be null or greater than 0.");
    }
    updates.compareAtLKR = compare;
  }
  if (payload.stock !== undefined) {
    const stock = Math.round(Number(payload.stock));
    if (!Number.isFinite(stock) || stock < 0) {
      throw createHttpError(400, "stock must be zero or greater.");
    }
    updates.stock = stock;
  }
  if (payload.active !== undefined) {
    updates.active = Boolean(payload.active);
  }

  const updateCategories =
    payload.categoryIds && Array.isArray(payload.categoryIds)
      ? {
          deleteMany: {},
          create: payload.categoryIds.map((categoryId) => ({ categoryId })),
        }
      : undefined;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...updates,
      ...(updateCategories ? { categories: updateCategories } : {}),
    },
    select: PRODUCT_SELECT,
  });

  await recordAudit({
    userId: actor?.userId,
    route: `/admin/products/${id}`,
    method: "PATCH",
    action: "PRODUCT_UPDATED",
    before: product,
    after: updated,
  });

  return formatProductResponse(updated);
};

const addProductImage = async ({ productId, payload, actor }) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true },
  });
  if (!product) {
    throw createHttpError(404, "Product not found.");
  }
  if (!payload?.url?.trim()) {
    throw createHttpError(400, "Image url is required.");
  }

  const position =
    payload.position ?? (await prisma.productImage.count({ where: { productId } }));

  const image = await prisma.productImage.create({
    data: {
      productId,
      url: payload.url.trim(),
      alt: payload.alt?.trim() || null,
      position: Number.isFinite(Number(position)) ? Number(position) : 0,
    },
  });

  await recordAudit({
    userId: actor?.userId,
    route: `/admin/products/${productId}/images`,
    method: "POST",
    action: "PRODUCT_IMAGE_ADDED",
    before: null,
    after: image,
  });

  return image;
};

const listCategories = async () =>
  prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: {
      ...CATEGORY_SELECT,
      children: {
        orderBy: { position: "asc" },
        select: CATEGORY_SELECT,
      },
    },
  });

const ensureUniqueCategorySlug = async (baseSlug, excludeId) => {
  let slug = baseSlug;
  let attempt = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return slug;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }
};

const createCategory = async ({ payload, actor }) => {
  const { name, slug: requestedSlug, parentId, position = 0 } = payload || {};
  if (!name?.trim()) {
    throw createHttpError(400, "name is required.");
  }
  const baseSlug = slugify(requestedSlug || name);
  const slug = await ensureUniqueCategorySlug(baseSlug);

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      parentId: parentId || null,
      position: Number(position) || 0,
    },
    select: CATEGORY_SELECT,
  });

  await recordAudit({
    userId: actor?.userId,
    route: "/admin/categories",
    method: "POST",
    action: "CATEGORY_CREATED",
    before: null,
    after: category,
  });

  return category;
};

const updateCategory = async ({ id, payload, actor }) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: CATEGORY_SELECT,
  });
  if (!category) {
    throw createHttpError(404, "Category not found.");
  }

  const updates = {};
  if (payload.name?.trim() && payload.name.trim() !== category.name) {
    updates.name = payload.name.trim();
  }
  if (payload.slug?.trim() && payload.slug.trim() !== category.slug) {
    updates.slug = await ensureUniqueCategorySlug(slugify(payload.slug.trim()), id);
  } else if (payload.name?.trim() && payload.slug === undefined) {
    // If only name changes, keep slug stable.
  }
  if (payload.parentId !== undefined) {
    updates.parentId = payload.parentId || null;
  }
  if (payload.position !== undefined) {
    updates.position = Number(payload.position) || 0;
  }

  const updated = await prisma.category.update({
    where: { id },
    data: updates,
    select: CATEGORY_SELECT,
  });

  await recordAudit({
    userId: actor?.userId,
    route: `/admin/categories/${id}`,
    method: "PATCH",
    action: "CATEGORY_UPDATED",
    before: category,
    after: updated,
  });

  return updated;
};

const listOrders = async ({ status, q, page, limit }) => {
  const filters = {};
  if (status && ALLOWED_STATUSES.includes(status)) {
    filters.status = status;
  }
  if (q?.trim()) {
    filters.OR = [
      { orderNo: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const pagination = sanitizePagination(page, limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.limit,
      include: ORDER_SUMMARY_INCLUDE,
    }),
    prisma.order.count({ where: filters }),
  ]);

  return {
    data: orders,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit) || 1,
    },
  };
};

const getOrderById = async ({ orderId }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      ...ORDER_SUMMARY_INCLUDE,
      payment: true,
    },
  });

  if (!order) {
    throw createHttpError(404, "Order not found.");
  }

  return order;
};

const updateOrderStatus = async ({ orderId, status, actor }) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw createHttpError(400, "Invalid status.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: ORDER_SUMMARY_INCLUDE,
  });
  if (!order) {
    throw createHttpError(404, "Order not found.");
  }

  const allowedTargets = ALLOWED_STATUS_TRANSITIONS[order.status] || [];
  if (!allowedTargets.includes(status)) {
    throw createHttpError(
      400,
      `Cannot change status from ${order.status} to ${status}.`,
    );
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      timeline: {
        create: {
          type: "STATUS_UPDATED",
          note: `Status changed to ${status} by ${actor?.userId || "system"}`,
        },
      },
    },
    include: ORDER_SUMMARY_INCLUDE,
  });

  await recordAudit({
    userId: actor?.userId,
    route: `/admin/orders/${orderId}/status`,
    method: "PATCH",
    action: "ORDER_STATUS_UPDATED",
    before: order,
    after: updated,
  });

  return updated;
};

const markOrderPaid = async ({ orderId, actor }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      ...ORDER_SUMMARY_INCLUDE,
      payment: true,
    },
  });
  if (!order) {
    throw createHttpError(404, "Order not found.");
  }
  if (!order.payment) {
    throw createHttpError(400, "Payment record missing for this order.");
  }
  if (order.paymentMethod !== "COD") {
    throw createHttpError(400, "Manual mark paid is only allowed for COD orders.");
  }
  if (order.paymentStatus === "PAID") {
    throw createHttpError(409, "Payment is already marked as paid.");
  }
  if (order.status === "CANCELLED" || order.status === "REFUNDED") {
    throw createHttpError(400, "Cannot mark paid for a cancelled/refunded order.");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: order.status === "PENDING" ? "PAID" : order.status,
      paymentStatus: "PAID",
      payment: {
        update: {
          status: "PAID",
        },
      },
      timeline: {
        create: {
          type: "PAYMENT_CAPTURED",
          note: "COD payment collected manually.",
        },
      },
    },
    include: ORDER_SUMMARY_INCLUDE,
  });

  await recordAudit({
    userId: actor?.userId,
    route: `/admin/orders/${orderId}/mark-paid`,
    method: "PATCH",
    action: "ORDER_MARKED_PAID",
    before: order,
    after: updated,
  });

  return updated;
};

const loadSettingsWithZones = async () => {
  const settings =
    (await prisma.storeSetting.findUnique({ where: { id: 1 } })) ||
    (await prisma.storeSetting.create({
      data: { id: 1, codEnabled: true, payhereSandbox: true },
    }));

  const zones = await prisma.shippingZone.findMany({
    orderBy: { name: "asc" },
    include: { rates: { orderBy: { minSubtotalLKR: "asc" } } },
  });

  return { settings, shippingZones: zones };
};

const upsertShippingZone = async (tx, zonePayload) => {
  const zoneData = {
    name: zonePayload.name?.trim() || "Shipping Zone",
    districts: Array.isArray(zonePayload.districts)
      ? zonePayload.districts.filter(Boolean)
      : [],
  };

  const zone = zonePayload.id
    ? await tx.shippingZone.update({
        where: { id: zonePayload.id },
        data: zoneData,
      })
    : await tx.shippingZone.create({
        data: zoneData,
      });

  const rateIdsToKeep = [];
  for (const rate of zonePayload.rates || []) {
    if (!rate.label?.trim()) {
      continue;
    }
    const rateData = {
      label: rate.label.trim(),
      minSubtotalLKR: Math.max(Math.round(Number(rate.minSubtotalLKR) || 0), 0),
      priceLKR: Math.max(Math.round(Number(rate.priceLKR) || 0), 0),
      zoneId: zone.id,
    };

    let storedRate;
    if (rate.id) {
      storedRate = await tx.shippingRate.update({
        where: { id: rate.id },
        data: rateData,
      });
    } else {
      storedRate = await tx.shippingRate.create({
        data: rateData,
      });
    }
    rateIdsToKeep.push(storedRate.id);
  }

  await tx.shippingRate.deleteMany({
    where: { zoneId: zone.id, id: { notIn: rateIdsToKeep } },
  });

  return zone.id;
};

const updateSettings = async ({ payload, actor }) => {
  const before = await loadSettingsWithZones();

  const { codEnabled, payhereMerchantId, payhereMerchantSecret, payhereSandbox, shippingNotes } =
    payload || {};

  const afterSettings = await prisma.$transaction(async (tx) => {
    const settings = await tx.storeSetting.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        codEnabled: codEnabled !== undefined ? Boolean(codEnabled) : true,
        payhereMerchantId: payhereMerchantId?.trim() || null,
        payhereMerchantSecret: payhereMerchantSecret?.trim() || null,
        payhereSandbox: payhereSandbox !== undefined ? Boolean(payhereSandbox) : true,
        shippingNotes: shippingNotes?.trim() || null,
      },
      update: {
        ...(codEnabled !== undefined ? { codEnabled: Boolean(codEnabled) } : {}),
        ...(payhereMerchantId !== undefined
          ? { payhereMerchantId: payhereMerchantId?.trim() || null }
          : {}),
        ...(payhereMerchantSecret !== undefined
          ? { payhereMerchantSecret: payhereMerchantSecret?.trim() || null }
          : {}),
        ...(payhereSandbox !== undefined ? { payhereSandbox: Boolean(payhereSandbox) } : {}),
        ...(shippingNotes !== undefined ? { shippingNotes: shippingNotes?.trim() || null } : {}),
      },
    });

    if (Array.isArray(payload?.shippingZones)) {
      const zoneIdsToKeep = [];
      for (const zonePayload of payload.shippingZones) {
        const zoneId = await upsertShippingZone(tx, zonePayload || {});
        zoneIdsToKeep.push(zoneId);
      }

      await tx.shippingZone.deleteMany({
        where: {
          id: { notIn: zoneIdsToKeep },
        },
      });
    }

    return settings;
  });

  const after = await loadSettingsWithZones();

  await recordAudit({
    userId: actor?.userId,
    route: "/admin/settings",
    method: "POST",
    action: "SETTINGS_UPDATED",
    before,
    after,
  });

  return after;
};

const listUsers = async ({ q, page, limit }) => {
  const filters = {};
  if (q?.trim()) {
    filters.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
    ];
  }
  const pagination = sanitizePagination(page, limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        suspended: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: filters }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit) || 1,
    },
  };
};

const updateUser = async ({ userId, payload, actor }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      suspended: true,
    },
  });
  if (!user) {
    throw createHttpError(404, "User not found.");
  }
  const updates = {};
  if (payload.role && ["CUSTOMER", "STAFF", "ADMIN"].includes(payload.role)) {
    updates.role = payload.role;
  }
  if (payload.suspended !== undefined) {
    updates.suspended = Boolean(payload.suspended);
  }
  if (!Object.keys(updates).length) {
    throw createHttpError(400, "No valid updates supplied.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      suspended: true,
    },
  });

  await recordAudit({
    userId: actor?.userId,
    route: `/admin/users/${userId}`,
    method: "PATCH",
    action: "USER_UPDATED",
    before: user,
    after: updated,
  });

  return updated;
};

const getOverview = async () => {
  const [orderAgg, userCount, lowStock] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalLKR: true },
      _count: { _all: true },
    }),
    prisma.user.count(),
    prisma.product.findMany({
      where: { stock: { lt: 5 } },
      select: { id: true, name: true, stock: true, slug: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      orderNo: true,
      totalLKR: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
  });

  return {
    revenueLKR: orderAgg._sum.totalLKR || 0,
    totalOrders: orderAgg._count._all || 0,
    totalUsers: userCount,
    lowStock,
    recentOrders,
  };
};

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  addProductImage,
  listCategories,
  createCategory,
  updateCategory,
  listOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaid,
  loadSettingsWithZones,
  updateSettings,
  listUsers,
  updateUser,
  getOverview,
};
