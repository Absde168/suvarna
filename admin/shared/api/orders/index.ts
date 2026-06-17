import { api } from "../axios";
import type {
  GetOrdersRequest,
  GetOrdersResponse,
  GetOrderByIdRequest,
  GetOrderByIdResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "./types";

export async function getOrders(params: GetOrdersRequest = {}): Promise<GetOrdersResponse> {
  const res = await api.get<GetOrdersResponse>("/admin/orders", { params });
  return res.data;
}

export async function getOrderById({ id }: GetOrderByIdRequest): Promise<GetOrderByIdResponse> {
  const res = await api.get<GetOrderByIdResponse>(`/admin/orders/${id}`);
  return res.data;
}

export async function updateOrderStatus({ id, status }: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
  const res = await api.patch<UpdateOrderStatusResponse>(`/admin/orders/${id}/status`, { status });
  return res.data;
}
