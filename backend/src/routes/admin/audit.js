const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { listAuditLogs } = require("../../services/audit.service");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN")];

router.use(...adminsOnly);

router.get("/", async (req, res, next) => {
  try {
    const payload = await listAuditLogs({
      page: req.query.page,
      limit: req.query.limit,
    });
    return respond.success(res, payload);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
