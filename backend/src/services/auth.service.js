const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const env = require("../config/env");
const { createHttpError } = require("../lib/respond");
const { verifyGoogleIdToken } = require("../lib/google");

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  phone: true,
  role: true,
  suspended: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    select: {
      id: true,
      fullName: true,
      phone: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      district: true,
      postalCode: true,
      country: true,
    },
  },
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const createSessionToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: Math.floor(env.sessionMaxAgeMs / 1000),
  });

const registerUser = async ({ email, password, firstName, lastName }) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw createHttpError(409, "Email already registered.");
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
    },
    select: userSelect,
  });

  const token = createSessionToken(user);
  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const userRecord = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!userRecord?.passwordHash) {
    throw createHttpError(401, "Invalid credentials.");
  }

  if (userRecord.suspended) {
    throw createHttpError(403, "Account is suspended.");
  }

  const passwordValid = await argon2.verify(
    userRecord.passwordHash,
    password,
  );

  if (!passwordValid) {
    throw createHttpError(401, "Invalid credentials.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userRecord.id },
    select: userSelect,
  });

  if (!user) {
    throw createHttpError(500, "Unable to load user profile.");
  }

  const token = createSessionToken(userRecord);
  return { user, token };
};

const loginWithGoogle = async ({ credential }) => {
  if (!credential || typeof credential !== "string") {
    throw createHttpError(400, "Google credential is required.");
  }

  const payload = await verifyGoogleIdToken(credential);
  const googleId = payload?.sub;
  const email = payload?.email;

  if (!googleId || !email) {
    throw createHttpError(400, "Google account is missing required info.");
  }

  const normalizedEmail = normalizeEmail(email);
  const givenName =
    payload?.given_name || payload?.name?.split(" ")?.[0] || null;
  const familyName =
    payload?.family_name || payload?.name?.split(" ")?.slice(1).join(" ") || null;
  const avatarUrl = payload?.picture || null;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ googleId }, { email: normalizedEmail }],
    },
  });

  let user;
  if (existingUser) {
    const updates = {};
    if (!existingUser.googleId) {
      updates.googleId = googleId;
    }
    if (!existingUser.firstName && givenName) {
      updates.firstName = givenName;
    }
    if (!existingUser.lastName && familyName) {
      updates.lastName = familyName;
    }
    if (avatarUrl && existingUser.avatarUrl !== avatarUrl) {
      updates.avatarUrl = avatarUrl;
    }

    if (Object.keys(updates).length > 0) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: updates,
        select: userSelect,
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: existingUser.id },
        select: userSelect,
      });
    }
  } else {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        googleId,
        firstName: givenName,
        lastName: familyName,
        avatarUrl,
      },
      select: userSelect,
    });
  }

  if (!user) {
    throw createHttpError(500, "Unable to complete Google sign-in.");
  }

  if (user.suspended) {
    throw createHttpError(403, "Account is suspended.");
  }

  const token = createSessionToken(user);
  return { user, token };
};

const getUserProfile = async (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  getUserProfile,
};
