import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

const Address = new Schema({
  City: { type: String, required: true },
  Country: { type: String, required: true },
  State: { type: String, required: true },
  Zip: { type: String, required: true },
  StreetAddress: { type: String, required: true },
});

const PaymentInfo = new Schema({
  AccountHolderName: { type: String, required: true },
  AccountHolderEmail: { type: String, required: true },
  BankName: { type: String, required: true },
  AccountNumber: { type: String, required: true },
});

const Location = new Schema({
  Latitude: { type: Number, required: true },
  Longtude: { type: Number, required: true },
});
const ShopSettings = new Schema({
  Location,
  ContactNumber: { type: String },
  Website: { type: String },
});

const Shops = new Schema(
  {
    Owner:{type:Schema.Types.ObjectId,required:true},
    Logo: String,
    CoverImage: String,
    Name: { type: String, required: true },
    Description: { type: String, default: "" },
    Active:{type:Boolean ,default:true},
    Address,
    PaymentInfo,
    ShopSettings,
  },
  { timestamps: true, collection: "Shops" }
);

export const ShopsModel = mongoose.model("Shops", Shops);
