import { api } from "../axios";
import type {
  GetProductByIdRequest,
  GetProductByIdResponse,
  GetProductsRequest,
  GetProductsResponse,
} from "./types";

export async function getProducts(
  params: GetProductsRequest = {}
): Promise<GetProductsResponse> {
  const { data } = await api.get<GetProductsResponse>("/products", { params });
  return data;
}

export async function getProductById({
  id,
}: GetProductByIdRequest): Promise<GetProductByIdResponse> {
  const { data } = await api.get<GetProductByIdResponse>(`/products/${id}`);
  return data;
}
