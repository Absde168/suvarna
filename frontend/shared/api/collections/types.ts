import type { Product } from "../products/types";

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  hasImage: boolean;
  count: number;
}

export type GetCollectionsResponse = Collection[];

export interface GetCollectionBySlugRequest {
  slug: string;
}

export interface CollectionDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  hasImage: boolean;
  products: Product[];
}

export type GetCollectionBySlugResponse = CollectionDetail;
