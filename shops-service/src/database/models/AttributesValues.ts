import mongoose, { Schema } from "mongoose";

const AttributesValues = new Schema(
  {
    Attribute:Schema.Types.ObjectId,
    Value: { type: String, required: true },
    Meta: String,
    IsDeleted:{type:Boolean,default:false}
  },
  { timestamps: true, collection: "AttributesValues" }
);

export const AttributesValuesModel =  mongoose.model("AttributesValues", AttributesValues);
