import { apiRequest } from "../api";

export type AddressPayload = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district: string;
  postalCode?: string | null;
};

export type Address = AddressPayload & {
  id: string;
  country?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function getAddresses(): Promise<{ items: Address[] }> {
  return apiRequest<{ items: Address[] }>("/me/addresses", { method: "GET" });
}

export async function createAddress(
  payload: AddressPayload,
): Promise<{ address: Address }> {
  return apiRequest<{ address: Address }>("/me/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(
  id: string,
  payload: Partial<AddressPayload>,
): Promise<{ address: Address }> {
  return apiRequest<{ address: Address }>(`/me/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/me/addresses/${id}`, {
    method: "DELETE",
  });
}
