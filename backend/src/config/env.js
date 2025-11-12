const MS_IN_DAY = 24 * 60 * 60 * 1000;

const parseOrigins = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const defaultOrigins = [
  "http://localhost:3000",
  "https://cornelectronics.com",
  "https://www.cornelectronics.com",
];

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  jwtSecret: process.env.JWT_SECRET || "corn-dev-secret-change-me",
  sessionCookieName: process.env.SESSION_COOKIE || "corn_session",
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS || 7 * MS_IN_DAY),
  webOrigins: parseOrigins(process.env.WEB_APP_ORIGIN)?.length
    ? parseOrigins(process.env.WEB_APP_ORIGIN)
    : defaultOrigins,
};

env.isProduction = env.nodeEnv === "production";

module.exports = env;
