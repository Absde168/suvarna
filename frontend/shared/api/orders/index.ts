import { api } from "../axios";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderByIdRequest,
  GetOrderByIdResponse,
} from "./types";

export async function createOrder(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const { data: order } = await api.post<CreateOrderResponse>("/orders", data);
  return order;
}

export async function getOrderById({
  id,
}: GetOrderByIdRequest): Promise<GetOrderByIdResponse> {
  const { data } = await api.get<GetOrderByIdResponse>(`/orders/${id}`);
  return data;
}
