import mongoose, { Schema } from "mongoose";
export interface MainGroupType {
  Key: string;
  GroupId: mongoose.Types.ObjectId;
}
const MainGroup = new Schema<MainGroupType>(
  {
    Key: { type: String, required: true, unique: true },
    GroupId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true, collection: "MainGroup" }
);

export const MainGroupModel = mongoose.model("MainGroup", MainGroup);
