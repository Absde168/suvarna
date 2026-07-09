import { api } from "../axios";

export interface AdminCoupon {
  id: number;
  code: string;
  percent: number;
  active: boolean;
  categoryId: number | null;
  productId: number | null;
  category: { id: number; name: string } | null;
  product: { id: number; name: string } | null;
  createdAt: string;
}

export interface CreateCouponInput {
  code: string;
  percent: number;
  categoryId?: number | null;
  productId?: number | null;
}

export async function getAdminCoupons(): Promise<AdminCoupon[]> {
  const { data } = await api.get<AdminCoupon[]>("/admin/coupons");
  return data;
}

export async function createAdminCoupon(input: CreateCouponInput): Promise<AdminCoupon> {
  const { data } = await api.post<AdminCoupon>("/admin/coupons", input);
  return data;
}

export async function toggleAdminCoupon(id: number, active: boolean): Promise<AdminCoupon> {
  const { data } = await api.patch<AdminCoupon>(`/admin/coupons/${id}`, { active });
  return data;
}

export async function deleteAdminCoupon(id: number): Promise<void> {
  await api.delete(`/admin/coupons/${id}`);
}
