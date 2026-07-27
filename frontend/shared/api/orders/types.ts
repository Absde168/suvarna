export type DeliveryMethod = "courier" | "pickup" | "cdek" | "post";
export type PaymentMethod = "card" | "sbp" | "dolyame";

export interface OrderItemInput {
  productId: number;
  size: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  size: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  method: string;
  status: string;
  amount: number;
  currency: string;
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
  status: string;
  totalPrice: number;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
}

export interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryMethod: DeliveryMethod;
  city?: string;
  address?: string;
  apartment?: string;
  comment?: string;
  paymentMethod: PaymentMethod;
  items: OrderItemInput[];
  couponCode?: string;
}

export type CreateOrderResponse = Order & { confirmationUrl?: string };

export interface GetOrderByIdRequest {
  id: number;
}

export type GetOrderByIdResponse = Order;
