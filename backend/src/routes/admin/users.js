const { Router } = require("express");
const respond = require("../../lib/respond");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { listUsers, updateUser } = require("../../services/admin.service");

const router = Router();
const adminsOnly = [requireAuth, requireRole("ADMIN")];

router.use(...adminsOnly);

router.get("/", async (req, res, next) => {
  try {
    const payload = await listUsers({
      q: req.query.q,
      page: req.query.page,
      limit: req.query.limit,
    });
    return respond.success(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const user = await updateUser({
      userId: req.params.id?.trim(),
      payload: req.body || {},
      actor: req.user,
    });
    return respond.success(res, { user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
