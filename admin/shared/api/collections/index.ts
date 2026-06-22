import { api } from "../axios";
import type {
  GetCollectionsResponse,
  CreateCollectionRequest,
  CreateCollectionResponse,
  UpdateCollectionRequest,
  UpdateCollectionResponse,
  DeleteCollectionRequest,
  SetCollectionImageRequest,
  DeleteCollectionImageRequest,
} from "./types";

export async function getAdminCollections(): Promise<GetCollectionsResponse> {
  const res = await api.get<GetCollectionsResponse>("/admin/collections");
  return res.data;
}

export async function createCollection({ data }: CreateCollectionRequest): Promise<CreateCollectionResponse> {
  const res = await api.post<CreateCollectionResponse>("/admin/collections", data);
  return res.data;
}

export async function updateCollection({ id, data }: UpdateCollectionRequest): Promise<UpdateCollectionResponse> {
  const res = await api.put<UpdateCollectionResponse>(`/admin/collections/${id}`, data);
  return res.data;
}

export async function deleteCollection({ id }: DeleteCollectionRequest): Promise<void> {
  await api.delete(`/admin/collections/${id}`);
}

export async function setCollectionImage({ id, file }: SetCollectionImageRequest): Promise<void> {
  const formData = new FormData();
  formData.append("image", file);
  await api.put(`/admin/collections/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteCollectionImage({ id }: DeleteCollectionImageRequest): Promise<void> {
  await api.delete(`/admin/collections/${id}/image`);
}

export async function reorderCollections({ order }: { order: number[] }): Promise<void> {
  await api.put("/collections/reorder", { order });
}
