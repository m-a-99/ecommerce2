import { OrderStatusType } from "./OrderStatusType";
import { ProductType } from "./ProductType"
import { ShopsType } from "./ShopsType";
import { AddressType, ContactType } from "./UserInfoType";

export type OrderItem ={
  Product:ProductType,
  Quantity: number,
}

export type OrderShop = {
  AdminDeliveryStatus: string,
  Message:string,
  MessageLog:string,
  ShopId: string;
  Shop: ShopsType;
  OrderItems: [OrderItem];
  ShopOrderStatus: OrderStatusType;
  Amount: number;
};

export type OrdersType = {
  _id: string;
  UserId: string;
  Status: OrderStatusType;
  DeliverySchedule: string;
  BillingAddress: AddressType;
  ShippingAddress: AddressType;
  Contacts:ContactType[];
  OrderShops: [OrderShop];
  Total: number;
  SessionId: string;
  createdAt: string;
};

