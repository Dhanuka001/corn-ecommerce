const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN")];

router.use(...adminsOnly, (_req, res) =>
  respond.notImplemented(res, "Admin settings API"),
);

module.exports = router;
