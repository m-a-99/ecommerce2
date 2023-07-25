import { ProductType } from "./ProductType"
import { ShopsType } from "./ShopsType";
import { AddressType, ContactType } from "./UserInfoType";


export type OrderItem ={
  Product:ProductType,
  Quantity: number,
}


export type OrderShop = {
  ShopId: string;
  Shop:ShopsType;
  OrderItems: [OrderItem];
  ShopOrderStatus: string;
  Amount: number;
};


export type OrdersType = {
  _id: string;
  UserId: string;
  Status: string;
  DeliverySchedule: string;
  BillingAddress: AddressType;
  ShippingAddress: AddressType;
  Contacts:ContactType[];
  OrderShops: [OrderShop];
  Total: number;
  SessionId: string;
  createdAt: string;
};

