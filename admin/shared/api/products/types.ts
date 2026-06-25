export interface ProductImage {
  id: number;
  position: number;
  mimeType: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductCollection {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  article: string;
  price: number;
  quantity: number;
  sizes: string[];
  colors: string[];
  description: string | null;
  fabric: string | null;
  care: string | null;
  isNew: boolean;
  isBestseller: boolean;
  inStock: boolean;
  categories: ProductCategory[];
  collection: ProductCollection | null;
  images: ProductImage[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  sortBy?: "name" | "article" | "price" | "quantity" | "createdAt" | "position";
  sortDir?: "asc" | "desc";
}

export interface GetProductsResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetProductByIdRequest {
  id: number;
}

export type GetProductByIdResponse = Product;

export interface ProductInput {
  name: string;
  article: string;
  price: number;
  quantity: number;
  sizes: string[];
  colors: string[];
  description?: string | null;
  fabric?: string | null;
  care?: string | null;
  isNew?: boolean;
  isBestseller?: boolean;
  inStock?: boolean;
  categoryIds?: number[];
  collectionId?: number | null;
}

export interface CreateProductRequest {
  data: ProductInput;
}

export type CreateProductResponse = Product;

export interface UpdateProductRequest {
  id: number;
  data: ProductInput;
}

export type UpdateProductResponse = Product;

export interface DeleteProductRequest {
  id: number;
}

export interface AddProductImageRequest {
  productId: number;
  file: File;
}

export type AddProductImageResponse = ProductImage;

export interface DeleteProductImageRequest {
  productId: number;
  imageId: number;
}

export interface ReorderProductImagesRequest {
  productId: number;
  order: number[];
}

export type ReorderProductImagesResponse = ProductImage[];
