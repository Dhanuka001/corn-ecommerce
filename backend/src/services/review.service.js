const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");

const sanitizeImageList = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((entry) => (entry ? String(entry).trim() : ""))
    .filter((entry) => entry);
};

const listProductReviews = async ({ productId, page = 1, limit = 8 }) => {
  const skip = Math.max(page - 1, 0) * limit;
  const [total, reviews] = await Promise.all([
    prisma.productReview.count({ where: { productId } }),
    prisma.productReview.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const agg = await prisma.productReview.aggregate({
    where: { productId },
    _avg: { rating: true },
  });

  return {
    reviews,
    total,
    averageRating: agg._avg.rating ?? 0,
  };
};

const listLatestReviews = async ({ limit = 4 }) => {
  return prisma.productReview.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

const ensurePurchased = async ({ userId, productId }) => {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      paymentStatus: "PAID",
      status: { in: ["PAID", "FULFILLED"] },
      items: {
        some: {
          productId,
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (!order) {
    throw createHttpError(
      403,
      "You can only review products you have purchased.",
    );
  }
  return order.id;
};

const createReview = async ({ userId, productId, rating, title, body, images }) => {
  if (!productId) {
    throw createHttpError(400, "Product is required.");
  }
  const normalizedRating = Number(rating);
  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 5
  ) {
    throw createHttpError(400, "Rating must be between 1 and 5.");
  }

  const orderId = await ensurePurchased({ userId, productId });

  const review = await prisma.productReview.create({
    data: {
      productId,
      userId,
      orderId,
      rating: normalizedRating,
      title: title?.trim() || "No title",
      body: body?.trim() || "",
      images: sanitizeImageList(images),
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return review;
};

const deleteReview = async (reviewId) => {
  await prisma.productReview.delete({
    where: { id: reviewId },
  });
};

const listReviewsForAdmin = async ({ productId, page = 1, limit = 20 }) => {
  const skip = Math.max(page - 1, 0) * limit;
  const reviews = await prisma.productReview.findMany({
    where: productId ? { productId } : undefined,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
  const total = await prisma.productReview.count({
    where: productId ? { productId } : undefined,
  });
  return { total, reviews };
};

module.exports = {
  listProductReviews,
  listLatestReviews,
  createReview,
  deleteReview,
  listReviewsForAdmin,
};
