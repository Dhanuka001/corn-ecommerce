const rateLimit = require("express-rate-limit");

const createRateLimiter = ({
  windowMs = 60 * 1000,
  limit = 10,
  message = { error: "Too many requests, slow down." },
} = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message,
  });

const authLimiter = createRateLimiter({
  limit: 10,
  message: { error: "Too many attempts, please slow down." },
});

module.exports = {
  createRateLimiter,
  authLimiter,
};
