import mongoose,{ Schema } from "mongoose";
import { Types } from "mongoose";

export interface AddressType {
  Title:string
  Country:string
  City: string
  State: string
  Zip: string
  StreetAddress: string
}

export interface ContactType {
  Title:string;
  Value:string;
}

export interface UsersType {
  AccountType: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Img: string;
  Bio: string;
  Password: string;
  Contacts:Types.DocumentArray<ContactType>
  ShippingAddress?: AddressType;
  BillingAddress?: AddressType;
}

const Address = new Schema<AddressType>({
  Title: { type: String, required: true },
  Country: { type: String, required: true },
  City: { type: String, required: true },
  State: { type: String, required: true },
  Zip: { type: String, required: true },
  StreetAddress: { type: String, required: true },
});

const Contact = new Schema<ContactType>({
  Title: { type: String, required: true },
  Value: { type: String, required: true },
});

const Users = new Schema<UsersType>(
  {
    AccountType: { type: String, values: ["Client", "Seller"], required: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Img: { type: String },
    Bio: { type: String, default: "" },
    Password: { type: String, required: true },
    Contacts: [Contact],
    ShippingAddress: Address,
    BillingAddress: Address,
  },
  { timestamps: true, collection: "Users" }
);

export const UsersModel= mongoose.model("Users", Users);
