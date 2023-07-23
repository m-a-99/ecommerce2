import mongoose, { Schema } from "mongoose";

const Currency = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true, collection: "Currency" }
);

export const CurrencyModel = mongoose.model("Currency", Currency);
