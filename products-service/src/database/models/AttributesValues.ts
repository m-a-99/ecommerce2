import mongoose, { Schema } from "mongoose";

export interface AttributesValuesType {
  Attribute: mongoose.Types.ObjectId;
  Value: string;
  Meta?: string;
  IsDeleted:boolean;
}
const AttributesValues = new Schema<AttributesValuesType>(
  {
    Attribute: Schema.Types.ObjectId,
    Value: { type: String, required: true },
    Meta: String,
    IsDeleted:{type:Boolean,default:false}
  },
  { timestamps: true, collection: "AttributesValues" }
);

export const AttributesValuesModel =  mongoose.model("AttributesValues", AttributesValues);
