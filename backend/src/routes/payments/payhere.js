const { Router } = require("express");
const respond = require("../../lib/respond");

const router = Router();

router.use((_req, res) =>
  respond.notImplemented(res, "PayHere integration"),
);

module.exports = router;
