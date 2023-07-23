import mongoose, { Schema } from "mongoose";
export interface ExternalProductType {
  URL: string;
  ButtonLabel: string;
}

export interface SimpleProductType {
  Price: number;
  SalePrice?: number;
  Quantity: number;
  SKU?: string;
  Width?: string;
  Height?: string;
  Length?: string;
  IsDigital: boolean;
  IsExternal: boolean;
  ExternalProduct?: ExternalProductType;
  DigitalProductFile?: string;
}

export interface VarientAttributeValueType {
  Attribute:  mongoose.Types.ObjectId;
  Value:  mongoose.Types.ObjectId;
}

export interface VariableProductVarientType {
  _id: mongoose.Types.ObjectId;
  VarientAttributesValues: VarientAttributeValueType[];
  IsDisabled: boolean;
  Price: number;
  SalePrice?: number;
  Quantity: number;
  SKU: string;
  Image: string;
  IsDigital: boolean;
  IsExternal: boolean;
  ExternalProduct: ExternalProductType;
  DigitalProductFile?: string;
}

export interface ProductsType {
  State: string;
  Message: string;
  MessageLog:string;
  FeaturedImage?: string;
  Gallery: string[];
  ShopId: mongoose.Types.ObjectId;
  Group: mongoose.Types.ObjectId;
  Categories: mongoose.Types.ObjectId[];
  Authors: mongoose.Types.ObjectId[];
  Manufacturers: mongoose.Types.ObjectId[];
  Tags: mongoose.Types.ObjectId[];
  Name: string;
  Description: string;
  Unit: string;
  Status: string;
  ProductType: string;
  SimpleProduct?: SimpleProductType;
  VariableProduct: VariableProductVarientType[];
}


const ExternalProduct = new Schema<ExternalProductType>({
  URL: { type: String, required: true },
  ButtonLabel: { type: String, required: true },
});

const SimpleProduct = new Schema<SimpleProductType>({
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

const VarientAttributeValue = new Schema<VarientAttributeValueType>({
  Attribute: { type: Schema.Types.ObjectId, required: true },
  Value: { type: Schema.Types.ObjectId, required: true },
});

const VariableProductVarient = new Schema<VariableProductVarientType>({
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

const Products = new Schema<ProductsType>(
  {
    State:{type:String,values:["Pending","Rejected","Approved"],default:"Pending"},
    Message:{type:String,default:""},
    MessageLog:{type:String,defult:""},
    FeaturedImage: { type: String },
    Gallery: [{ type: String }],
    ShopId: { type: Schema.Types.ObjectId, required: true },
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
  },
  { timestamps: true, collection: "Products" }
);
export const ProductsModel = mongoose.model("Products", Products);
