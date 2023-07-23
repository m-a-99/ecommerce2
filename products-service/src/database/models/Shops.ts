import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);
export interface AddressType {
  City: string
  Country: string
  State: string
  Zip: string
  StreetAddress: string
}

export interface PaymentInfoType {
  AccountHolderName:string
  AccountHolderEmail:string
  BankName:string
  AccountNumber:string
}

export interface LocationType {
  Latitude: number;
  Longtude: number;
}

export interface ShopSettingsType {
  Location: LocationType;
  ContactNumber: string;
  Website: string;
}

export interface ShopType {
  Owner: mongoose.Types.ObjectId;
  Logo?: string;
  CoverImage?: string;
  Name: string;
  Description: string;
  Active: boolean;
  Address: AddressType;
  PaymentInfo: PaymentInfoType;
  ShopSettings: ShopSettingsType;
}

const Address = new Schema<AddressType>({
  City: { type: String, required: true },
  Country: { type: String, required: true },
  State: { type: String, required: true },
  Zip: { type: String, required: true },
  StreetAddress: { type: String, required: true },
});

const PaymentInfo = new Schema<PaymentInfoType>({
  AccountHolderName: { type: String, required: true },
  AccountHolderEmail: { type: String, required: true },
  BankName: { type: String, required: true },
  AccountNumber: { type: String, required: true },
});

const Location = new Schema<LocationType>({
  Latitude: { type: Number, required: true },
  Longtude: { type: Number, required: true },
});
const ShopSettings = new Schema<ShopSettingsType>({
  Location,
  ContactNumber: { type: String },
  Website: { type: String },
});

const Shops = new Schema<ShopType>(
  {
    Owner: { type: Schema.Types.ObjectId, required: true },
    Logo: String,
    CoverImage: String,
    Name: { type: String, required: true },
    Description: { type: String, default: "" },
    Active: { type: Boolean, default: true },
    Address,
    PaymentInfo,
    ShopSettings,
  },
  { timestamps: true, collection: "Shops" }
);

export const ShopsModel = mongoose.model("Shops", Shops);
