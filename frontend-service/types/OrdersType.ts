import { ProductType } from "./ProductType"


export type OrderItem ={
  Product:ProductType,
  Quantity: number,
}

export type OrdersType = {
  _id: string;
  UserId: string;
  Status: string;
  DeliverySchedule: string;
  OrderItems: [OrderItem];
  Amount: number;
  SessionId: string;
  createdAt:string;
};
