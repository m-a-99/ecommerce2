import mongoose, { Schema } from "mongoose";

const MainGroup = new Schema(
  {
    Key: { type: String, required: true, unique: true },
    GroupId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true, collection: "MainGroup" }
);

export const MainGroupModel = mongoose.model("MainGroup", MainGroup);
