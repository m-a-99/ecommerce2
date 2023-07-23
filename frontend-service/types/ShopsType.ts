import { UserInfoType } from "./UserInfoType";

type Address = {
  City: string;
  Country: string;
  State: string;
  Zip: string;
  StreetAddress: string;
  _id: string;
};
type PaymentInfo = {
  AccountHolderName: string;
  AccountHolderEmail: string;
  BankName: string;
  AccountNumber: string;
  _id: string;
};

type Location = {
  Latitude: number;
  Longtude: number;
  _id: string;
};
type ShopSettings = {
  Location: Location;
  ContactNumber: string;
  Website: string;
  _id: string;
};
export type ShopsType = {
  _id: string;
  Logo: string;
  Owner: UserInfoType;
  CoverImage: string;
  Name: string;
  Description: string;
  Active: boolean;
  ProductsCount?: number;
  Address: Address;
  PaymentInfo: PaymentInfo;
  ShopSettings: ShopSettings;
  createdAt:string;
};
