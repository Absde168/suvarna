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
  category: ProductCategory | null;
  collection: ProductCollection | null;
  images: ProductImage[];
}

export interface GetProductsRequest {
  category?: string;
  collection?: string;
}

export type GetProductsResponse = Product[];

export interface GetProductByIdRequest {
  id: number;
}

export type GetProductByIdResponse = Product;
