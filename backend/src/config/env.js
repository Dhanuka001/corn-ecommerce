const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const backendRoot = path.resolve(__dirname, "../..");
const nodeEnvFromProcess = process.env.NODE_ENV || "development";

const loadEnvFile = (filename) => {
  const filePath = path.join(backendRoot, filename);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
};

loadEnvFile(".env");
loadEnvFile(`.env.${nodeEnvFromProcess}`);

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
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  sessionCookieName: process.env.SESSION_COOKIE || "corn_session",
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS || 7 * MS_IN_DAY),
  webOrigins: parseOrigins(process.env.WEB_APP_ORIGIN)?.length
    ? parseOrigins(process.env.WEB_APP_ORIGIN)
    : defaultOrigins,
};

env.isProduction = env.nodeEnv === "production";

module.exports = env;
