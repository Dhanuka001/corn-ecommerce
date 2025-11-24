import { apiRequest } from "../api";

export type CheckoutSummaryResponse = {
  subTotalLKR: number;
  shippingLKR: number;
  discountLKR: number;
  totalLKR: number;
  shippingRate: {
    id: string;
    label: string;
  };
};

export async function fetchCheckoutSummary(payload: {
  cartId: string;
  shippingAddressId: string;
}): Promise<CheckoutSummaryResponse> {
  return apiRequest<CheckoutSummaryResponse>("/checkout/summary", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
