import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

const Local = new Schema({
  Country: { type: String, required: true },
  State: { type: String, required: true },
  ZIP: { type: String, required: true },
});

const Shippings = new Schema(
  {
    Name: { type: String, required: true },
    ShippingType: { type: String, values: ["Free", "Fixed", "Percentage"], message: "{ShippingType} is not valid", required: true },
    Amount: { type: Number, default: 0 },
    Global: { type: Boolean, default: false },
    Local,
  },
  { timestamps: true, collection: "Shippings" }
);

export const ShippingsModel = mongoose.model("Shippings", Shippings);
