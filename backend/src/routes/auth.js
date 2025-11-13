const { Router } = require("express");
const respond = require("../lib/respond");
const { authLimiter } = require("../middleware/ratelimit");
const {
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
} = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserProfile,
  loginWithGoogle,
} = require("../services/auth.service");

const router = Router();

const isValidEmail = (email) =>
  typeof email === "string" && email.includes("@");

const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 8;

router.post("/register", authLimiter, async (req, res) => {
  const { email, password, firstName, lastName } = req.body || {};

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return respond.error(
      res,
      400,
      "Valid email and password (min 8 chars) are required.",
    );
  }

  try {
    const { user, token } = await registerUser({
      email,
      password,
      firstName,
      lastName,
    });
    setSessionCookie(res, token);
    return respond.success(res, { user }, 201);
  } catch (error) {
    const status = error.status || 500;
    return respond.error(res, status, error.message || "Unable to register.");
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body || {};

  if (!isValidEmail(email) || typeof password !== "string") {
    return respond.error(res, 400, "Email and password are required.");
  }

  try {
    const { user, token } = await loginUser({ email, password });
    setSessionCookie(res, token);
    return respond.success(res, { user });
  } catch (error) {
    const status = error.status || 500;
    return respond.error(res, status, error.message || "Unable to login.");
  }
});

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  respond.success(res, { success: true });
});

router.post("/google", authLimiter, async (req, res) => {
  const { credential } = req.body || {};

  if (typeof credential !== "string" || credential.length < 10) {
    return respond.error(res, 400, "Google credential is required.");
  }

  try {
    const { user, token } = await loginWithGoogle({ credential });
    setSessionCookie(res, token);
    return respond.success(res, { user });
  } catch (error) {
    const status = error.status || 500;
    return respond.error(
      res,
      status,
      error.message || "Unable to sign in with Google.",
    );
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserProfile(req.user.userId);
    if (!user) {
      clearSessionCookie(res);
      return respond.error(res, 401, "Unauthorized");
    }
    return respond.success(res, { user });
  } catch (error) {
    return respond.error(res, 500, "Unable to fetch user.");
  }
});

module.exports = router;
