const { OAuth2Client } = require("google-auth-library");
const env = require("../config/env");
const { createHttpError } = require("./respond");

let googleClient;

if (env.googleClientId) {
  googleClient = new OAuth2Client(env.googleClientId);
}

async function verifyGoogleIdToken(idToken) {
  if (!googleClient) {
    throw createHttpError(
      500,
      "Google login is not configured on the server.",
    );
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    return ticket.getPayload();
  } catch (error) {
    throw createHttpError(401, "Invalid Google credential.");
  }
}

module.exports = {
  verifyGoogleIdToken,
};
