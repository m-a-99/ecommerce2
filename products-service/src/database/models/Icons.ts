import mongoose, { Schema } from "mongoose";

export interface IconsType {
  Name:string;
  Url:string;
}
const Icons = new Schema<IconsType>(
  {
    Name: { type: String, required: true },
    Url: { type: String, required: true },
  },
  { timestamps: true, collection: "Icons" }
);

export const IconsModel = mongoose.model("Icons", Icons);
