import mongoose, { Schema } from "mongoose";

mongoose.set("strictQuery", true);


const Attributes = new Schema(
  {
    ShopId:{type:Schema.Types.ObjectId,required:true},
    Name: { type: String, required: true },
  },
  { timestamps: true, collection: "Attributes" }
);

export const AttributesModel = mongoose.model("Attributes", Attributes);
