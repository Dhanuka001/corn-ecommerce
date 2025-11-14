const { OAuth2Client } = require("google-auth-library");
const env = require("../config/env");
const { createHttpError } = require("./respond");

const VALID_ISSUERS = new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);

const allowedAudiences = Array.isArray(env.googleClientIds)
  ? env.googleClientIds.filter(Boolean)
  : env.googleClientId
    ? [env.googleClientId]
    : [];

let googleClient;

if (allowedAudiences.length) {
  googleClient = new OAuth2Client(
    allowedAudiences[0],
    env.googleClientSecret || undefined,
  );
}

async function verifyGoogleIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw createHttpError(400, "Google credential is required.");
  }

  if (!googleClient || !allowedAudiences.length) {
    throw createHttpError(
      500,
      "Google login is not configured on the server.",
    );
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: allowedAudiences,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Missing payload");
    }

    const {
      aud,
      email,
      email_verified: emailVerified,
      exp,
      iss,
      sub,
    } = payload;

    if (!sub) {
      throw createHttpError(401, "Google credential is missing subject claim.");
    }

    if (!VALID_ISSUERS.has(iss)) {
      throw createHttpError(401, "Google credential issuer is invalid.");
    }

    const normalizedAud = (aud || "").trim();
    if (!allowedAudiences.includes(normalizedAud)) {
      throw createHttpError(401, "Google credential audience mismatch.");
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!exp || exp <= nowSeconds) {
      throw createHttpError(401, "Google credential has expired.");
    }

    const isEmailVerified =
      typeof emailVerified === "boolean"
        ? emailVerified
        : String(emailVerified).toLowerCase() === "true";

    if (!email || !isEmailVerified) {
      throw createHttpError(401, "Google account email is not verified.");
    }

    return payload;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw createHttpError(401, "Invalid Google credential.");
  }
}

module.exports = {
  verifyGoogleIdToken,
};
