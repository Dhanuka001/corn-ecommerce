const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const env = require("../config/env");
const { createHttpError } = require("../lib/respond");

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    select: {
      id: true,
      fullName: true,
      phone: true,
      line1: true,
      line2: true,
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

const getUserProfile = async (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
