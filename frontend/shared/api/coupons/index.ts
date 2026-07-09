import { api } from "../axios";

export interface ValidateCouponRequest {
  code: string;
  items: { productId: number; quantity: number }[];
}

export interface ValidateCouponResponse {
  valid: boolean;
  error?: string;
  code?: string;
  percent?: number;
  discount?: number;
  itemsTotal?: number;
  appliedProductIds?: number[];
}

export async function validateCoupon(
  data: ValidateCouponRequest
): Promise<ValidateCouponResponse> {
  const { data: res } = await api.post<ValidateCouponResponse>("/coupons/validate", data);
  return res;
}
