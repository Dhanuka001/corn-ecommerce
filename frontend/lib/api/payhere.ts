import { apiRequest } from "../api";

export type PayhereInitResponse = {
  redirectUrl: string;
  payload: Record<string, string>;
  amountLKR: number;
};

export async function createPayherePayment(payload: {
  shippingAddressId: string;
  billingAddressId?: string;
}) {
  return apiRequest<PayhereInitResponse>("/payments/payhere/create-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
