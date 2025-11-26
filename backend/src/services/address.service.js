const prisma = require("../lib/prisma");
const { createHttpError } = require("../lib/respond");

const ADDRESS_SELECT = {
  id: true,
  fullName: true,
  phone: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  district: true,
  postalCode: true,
  country: true,
  createdAt: true,
  updatedAt: true,
};

const listAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: ADDRESS_SELECT,
  });
};

const createAddress = async (userId, payload) => {
  const requiredFields = [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "district",
  ];
  for (const field of requiredFields) {
    if (!payload[field]?.trim()) {
      throw createHttpError(400, `${field} is required.`);
    }
  }

  const data = {
    userId,
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    addressLine1: payload.addressLine1.trim(),
    addressLine2: payload.addressLine2?.trim() || null,
    city: payload.city.trim(),
    district: payload.district.trim(),
    postalCode: payload.postalCode?.trim() || null,
  };

  return prisma.address.create({ data, select: ADDRESS_SELECT });
};

const updateAddress = async (userId, addressId, payload) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    throw createHttpError(404, "Address not found.");
  }

  const data = {
    fullName: payload.fullName?.trim(),
    phone: payload.phone?.trim(),
    addressLine1: payload.addressLine1?.trim(),
    addressLine2:
      payload.addressLine2 === undefined
        ? undefined
        : payload.addressLine2?.trim() || null,
    city: payload.city?.trim(),
    district: payload.district?.trim(),
    postalCode:
      payload.postalCode === undefined
        ? undefined
        : payload.postalCode?.trim() || null,
  };

  return prisma.address.update({
    where: { id: addressId },
    data,
    select: ADDRESS_SELECT,
  });
};

const deleteAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    throw createHttpError(404, "Address not found.");
  }
  await prisma.address.delete({ where: { id: addressId } });
  return true;
};

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
