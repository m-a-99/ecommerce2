import mongoose, { Schema } from "mongoose";

const OrderStatus = new Schema(
  {
    Name: { type: String, required: true },
    Serial: { type: Number, required: true },
    Color: { type: String, required: true },
  },
  { timestamps: true, collection: "OrderStatus" }
);

export const OrderStatusModel= mongoose.model("OrderStatus", OrderStatus);
