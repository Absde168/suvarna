export type OrderStatus = "new" | "processing" | "shipped" | "completed" | "cancelled";

export interface OrderItem {
  id: number;
  productId: number;
  size: string;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    article: string;
  };
}

export interface Payment {
  id: number;
  method: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
}

export interface Order {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryMethod: string;
  city: string | null;
  address: string | null;
  apartment: string | null;
  comment: string | null;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
}

export interface GetOrdersRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus | "";
  sortBy?: "createdAt" | "totalPrice" | "status";
  sortDir?: "asc" | "desc";
}

export interface GetOrdersResponse {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetOrderByIdRequest {
  id: number;
}

export type GetOrderByIdResponse = Order;

export interface UpdateOrderStatusRequest {
  id: number;
  status: OrderStatus;
}

export type UpdateOrderStatusResponse = Order;
