import { api } from "../axios";
import type {
  GetProductsRequest,
  GetProductsResponse,
  GetProductByIdRequest,
  GetProductByIdResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductRequest,
  AddProductImageRequest,
  AddProductImageResponse,
  DeleteProductImageRequest,
  ReorderProductImagesRequest,
  ReorderProductImagesResponse,
} from "./types";

export async function getProducts(params: GetProductsRequest = {}): Promise<GetProductsResponse> {
  const res = await api.get<GetProductsResponse>("/admin/products", { params });
  return res.data;
}

export async function getProductById({ id }: GetProductByIdRequest): Promise<GetProductByIdResponse> {
  const res = await api.get<GetProductByIdResponse>(`/admin/products/${id}`);
  return res.data;
}

export async function createProduct({ data }: CreateProductRequest): Promise<CreateProductResponse> {
  const res = await api.post<CreateProductResponse>("/admin/products", data);
  return res.data;
}

export async function updateProduct({ id, data }: UpdateProductRequest): Promise<UpdateProductResponse> {
  const res = await api.put<UpdateProductResponse>(`/admin/products/${id}`, data);
  return res.data;
}

export async function deleteProduct({ id }: DeleteProductRequest): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}

export async function addProductImage({ productId, file }: AddProductImageRequest): Promise<AddProductImageResponse> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post<AddProductImageResponse>(`/admin/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteProductImage({ productId, imageId }: DeleteProductImageRequest): Promise<void> {
  await api.delete(`/admin/products/${productId}/images/${imageId}`);
}

export async function reorderProductImages({
  productId,
  order,
}: ReorderProductImagesRequest): Promise<ReorderProductImagesResponse> {
  const res = await api.put<ReorderProductImagesResponse>(`/admin/products/${productId}/images/reorder`, { order });
  return res.data;
}
