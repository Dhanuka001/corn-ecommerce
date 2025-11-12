const { Router } = require("express");
const respond = require("../lib/respond");

const router = Router();

router.get("/", (_req, res) => {
  respond.success(res, { status: "ok", timestamp: new Date().toISOString() });
});

module.exports = router;
