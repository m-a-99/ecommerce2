import mongoose, { Schema } from "mongoose";

const Icons = new Schema(
  {
    Name: { type: String, required: true },
    Url: { type: String, required: true },
  },
  { timestamps: true, collection: "Icons" }
);

export const IconsModel = mongoose.model("Icons", Icons);
