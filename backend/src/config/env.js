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

const parseList = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseBoolean = (value) => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y"].includes(normalized)) return true;
  if (["0", "false", "no", "n"].includes(normalized)) return false;
  return undefined;
};

const parseOrigins = parseList;

const defaultOrigins = [
  "http://localhost:3000",
  "https://cornelectronics.com",
  "https://www.cornelectronics.com",
];

const parsedWebOrigins = parseOrigins(process.env.WEB_APP_ORIGIN);
const resolvedWebOrigins = parsedWebOrigins.length
  ? parsedWebOrigins
  : defaultOrigins;
const defaultFrontend = resolvedWebOrigins[0] || "http://localhost:3000";
const backendBaseUrl = (process.env.BACKEND_URL || "http://localhost:8080").replace(/\/$/, "");
const frontendBaseUrl = (process.env.FRONTEND_URL || defaultFrontend).replace(/\/$/, "");
const googleClientIds = parseList(
  process.env.GOOGLE_CLIENT_IDS ||
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "",
);

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  jwtSecret: process.env.JWT_SECRET || "corn-dev-secret-change-me",
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || "5mb",
  googleClientId: googleClientIds[0] || "",
  googleClientIds,
  googleClientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
  sessionCookieName: process.env.SESSION_COOKIE || "corn_session",
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS || 7 * MS_IN_DAY),
  webOrigins: resolvedWebOrigins,
  frontendBaseUrl,
  backendBaseUrl,
  payhereMerchantId: (process.env.PAYHERE_MERCHANT_ID || "").trim(),
  payhereMerchantSecret: (process.env.PAYHERE_MERCHANT_SECRET || "").trim(),
  payhereSandbox:
    process.env.PAYHERE_SANDBOX === undefined
      ? true
      : String(process.env.PAYHERE_SANDBOX).toLowerCase() !== "false",
  payhereReturnUrl:
    (process.env.PAYHERE_RETURN_URL || `${frontendBaseUrl}/checkout/success`).trim(),
  payhereCancelUrl:
    (process.env.PAYHERE_CANCEL_URL || `${frontendBaseUrl}/checkout/cancel`).trim(),
  payhereNotifyUrl:
    (process.env.PAYHERE_NOTIFY_URL || `${backendBaseUrl}/payments/payhere/notify`).trim(),
  payhereCurrency: (process.env.PAYHERE_CURRENCY || "LKR").trim(),
  mailHost: (process.env.MAIL_HOST || "").trim(),
  mailPort: Number(process.env.MAIL_PORT || 587),
  mailSecure: parseBoolean(process.env.MAIL_SECURE) ?? false,
  mailUser: (process.env.MAIL_USER || "").trim(),
  mailPass: (process.env.MAIL_PASS || "").trim(),
  mailFromName: (process.env.MAIL_FROM_NAME || "Corn Electronics").trim(),
  mailFromAddress: (process.env.MAIL_FROM_ADDRESS || "support@cornelectronics.com").trim(),
};

env.isProduction = env.nodeEnv === "production";

module.exports = env;
