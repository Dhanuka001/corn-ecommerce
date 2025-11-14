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

const decodeSessionFromRequest = (req) => {
  const token = req.cookies?.[env.sessionCookieName];
  if (!token) {
    return { token: null, payload: null, invalid: false };
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    return { token, payload, invalid: false };
  } catch (error) {
    return { token, payload: null, invalid: true };
  }
};

const getSessionUser = (req) => {
  const { payload } = decodeSessionFromRequest(req);
  return payload || null;
};

const requireAuth = (req, res, next) => {
  const { payload, invalid } = decodeSessionFromRequest(req);
  if (!payload) {
    if (invalid) {
      clearSessionCookie(res);
    }
    return respond.error(res, 401, "Unauthorized");
  }
  req.user = payload;
  return next();
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
  getSessionUser,
};
