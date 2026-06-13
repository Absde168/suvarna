export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  hasImage: boolean;
  count: number;
}

export type GetCollectionsResponse = Collection[];

export interface CollectionInput {
  name: string;
  slug?: string;
  description?: string;
}

export interface SetCollectionImageRequest {
  id: number;
  file: File;
}

export interface DeleteCollectionImageRequest {
  id: number;
}

export interface CreateCollectionRequest {
  data: CollectionInput;
}

export type CreateCollectionResponse = Collection;

export interface UpdateCollectionRequest {
  id: number;
  data: CollectionInput;
}

export type UpdateCollectionResponse = Collection;

export interface DeleteCollectionRequest {
  id: number;
}
