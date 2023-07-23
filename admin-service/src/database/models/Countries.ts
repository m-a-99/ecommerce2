import mongoose, { Schema } from "mongoose";

const City = new Schema({
  name: { type: String, required: true },
});
const Countries = new Schema(
  {
    name: { type: String, required: true },
    Cities: [City],
  },
  { timestamps: true, collection: "Countries" }
);

export const CountriesModel = mongoose.model("Countries", Countries);
