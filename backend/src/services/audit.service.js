const prisma = require("../lib/prisma");

const sanitizeJson = (value) => {
  if (value === undefined) return null;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_err) {
    return null;
  }
};

const recordAudit = async ({ userId, route, method, action, before, after }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        route,
        method,
        action: action || null,
        before: sanitizeJson(before),
        after: sanitizeJson(after),
      },
    });
  } catch (error) {
    // Audit failures should never block the main request.
    console.error("Audit log error:", error);
  }
};

const listAuditLogs = async ({ page = 1, limit = 20 }) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: parsedLimit,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, role: true },
        },
      },
    }),
    prisma.auditLog.count(),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit) || 1,
    },
  };
};

module.exports = {
  recordAudit,
  listAuditLogs,
};
