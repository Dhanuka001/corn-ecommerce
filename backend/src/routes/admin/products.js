const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN", "STAFF")];

router.use(...adminsOnly, (_req, res) =>
  respond.notImplemented(res, "Admin products API"),
);

module.exports = router;
