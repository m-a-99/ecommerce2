import mongoose, { Schema } from "mongoose";

const OrderStatus = new Schema(
  {
    Name: { type: String, required: true },
    Serial: { type: Number, required: true },
    Role: { type: String, required: true },
    IsDeleted: { type: Boolean, default: false },
    Type: { type: String, values: ["Success", "Fail"], default: "Success" },
  },
  { timestamps: true, collection: "OrderStatus" }
);

export const OrderStatusModel = mongoose.model("OrderStatus", OrderStatus);
