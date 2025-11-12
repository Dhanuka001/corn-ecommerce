const jwt = require("jsonwebtoken");
const respond = require("../lib/respond");
const env = require("../config/env");

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.isProduction,
  path: "/",
};

const setSessionCookie = (res, token) => {
  res.cookie(env.sessionCookieName, token, {
    ...sessionCookieOptions,
    maxAge: env.sessionMaxAgeMs,
  });
};

const clearSessionCookie = (res) => {
  res.clearCookie(env.sessionCookieName, sessionCookieOptions);
};

const requireAuth = (req, res, next) => {
  const token = req.cookies?.[env.sessionCookieName];
  if (!token) {
    return respond.error(res, 401, "Unauthorized");
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    clearSessionCookie(res);
    return respond.error(res, 401, "Unauthorized");
  }
};

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return respond.error(res, 401, "Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      return respond.error(res, 403, "Forbidden");
    }
    return next();
  };

module.exports = {
  requireAuth,
  requireRole,
  setSessionCookie,
  clearSessionCookie,
};
