const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { getOverview } = require("../../services/admin.service");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN", "STAFF")];

router.use(...adminsOnly);

router.get("/", async (_req, res, next) => {
  try {
    const overview = await getOverview();
    return respond.success(res, { overview });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
