const { Router } = require("express");
const respond = require("../lib/respond");
const { requireAuth } = require("../middleware/auth");
const {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../services/address.service");

const router = Router();

router.use(requireAuth);

router.get("/addresses", async (req, res, next) => {
  try {
    const items = await listAddresses(req.user.userId);
    return respond.success(res, { items });
  } catch (error) {
    return next(error);
  }
});

router.post("/addresses", async (req, res, next) => {
  try {
    const payload = req.body || {};
    const address = await createAddress(req.user.userId, payload);
    return respond.success(res, { address }, 201);
  } catch (error) {
    return next(error);
  }
});

router.patch("/addresses/:id", async (req, res, next) => {
  try {
    const addressId = req.params.id?.trim();
    if (!addressId) {
      return respond.error(res, 400, "Address id is required.");
    }
    const payload = req.body || {};
    const address = await updateAddress(req.user.userId, addressId, payload);
    return respond.success(res, { address });
  } catch (error) {
    return next(error);
  }
});

router.delete("/addresses/:id", async (req, res, next) => {
  try {
    const addressId = req.params.id?.trim();
    if (!addressId) {
      return respond.error(res, 400, "Address id is required.");
    }
    await deleteAddress(req.user.userId, addressId);
    return respond.success(res, { success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
