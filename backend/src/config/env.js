const MS_IN_DAY = 24 * 60 * 60 * 1000;

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  jwtSecret: process.env.JWT_SECRET || "corn-dev-secret-change-me",
  sessionCookieName: process.env.SESSION_COOKIE || "corn_session",
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS || 7 * MS_IN_DAY),
  webOrigin: process.env.WEB_APP_ORIGIN || "http://localhost:3000",
};

env.isProduction = env.nodeEnv === "production";

module.exports = env;
