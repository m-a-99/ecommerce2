import mongoose, { Schema } from "mongoose";

mongoose.set("strictQuery", true);


export interface AttributesType {
  Name:string
  ShopId:mongoose.Types.ObjectId
}
const Attributes = new Schema<AttributesType>(
  {
    Name: { type: String, required: true },
    ShopId:{type:Schema.Types.ObjectId,required:true} 
  },
  { timestamps: true, collection: "Attributes" }
);

export const AttributesModel = mongoose.model("Attributes", Attributes);
