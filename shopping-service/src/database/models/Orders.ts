import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

const ExternalProduct = new Schema({
  URL: { type: String, required: true },
  ButtonLabel: { type: String, required: true },
});

const SimpleProduct = new Schema({
  Price: { type: Number, required: true },
  SalePrice: { type: Number },
  Quantity: { type: Number, required: true },
  SKU: { type: String },
  Width: { type: String },
  Height: { type: String },
  Length: { type: String },
  IsDigital: { type: Boolean, default: false },
  IsExternal: { type: Boolean, default: false },
  ExternalProduct,
  DigitalProductFile: { type: String },
});


const VarientAttributeValue = new Schema({
  Attribute: { _id: { type: Schema.Types.ObjectId, required: true }, Name: { type: String, required: true }},
  Value: {_id:{ type: Schema.Types.ObjectId, required: true },Attribute:{ type: Schema.Types.ObjectId, required: true }, Value: { type: String, required: true },Meta: { type: String, required: true }},
});

const VariableProductVarient = new Schema({
  VarientAttributesValues: [VarientAttributeValue],
  IsDisabled: { type: Boolean, default: false },
  Price: { type: Number, required: true },
  SalePrice: { type: Number },
  Quantity: { type: Number, required: true },
  SKU: { type: String },
  Image: { type: String },
  IsDigital: { type: Boolean, default: false },
  IsExternal: { type: Boolean, default: false },
  ExternalProduct,
  DigitalProductFile: { type: String },
});

const Product = new Schema({
  ShopId: { type: Schema.Types.ObjectId, required: true },
  FeaturedImage: { type: String },
  Gallery: [{ type: String }],
  Group: { type: Schema.Types.ObjectId, required: true },
  Categories: [{ type: Schema.Types.ObjectId }],
  Authors: [{ type: Schema.Types.ObjectId }],
  Manufacturers: [{ type: Schema.Types.ObjectId }],
  Tags: [{ type: Schema.Types.ObjectId }],
  Name: { type: String, required: true },
  Description: { type: String, default: "" },
  Unit: { type: String, required: true },
  Status: { type: String, values: ["Published", "Draft"], message: "{Status} is an invalid status" },
  ProductType: { type: String, values: ["Simple", "Variable"], message: "{ProductType} is an invalid ProductType" },
  SimpleProduct,
  VariableProduct: [VariableProductVarient],
});

const OrderItem = new Schema({
  Product,
  Quantity: { type: Number, required: true },
});

const Orders = new Schema(
  {
    UserId: { type: Schema.Types.ObjectId },
    Status: { type: Schema.Types.ObjectId },
    DeliverySchedule: { type: String, required: true },
    OrderItems: [OrderItem],
    Amount: { type: Number, default: 0 },
    SessionId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, collection: "orders" }
);

export const OrdersModel = mongoose.model("Orders", Orders);
