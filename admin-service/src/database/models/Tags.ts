import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

const Tags = new Schema(
  {
    Name: { type: String, required: true },
    Details: { type: String, default: "" },
    Icon: { type: Schema.Types.ObjectId, required: true },
    Group: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, collection: "Tags" }
);

export const TagsModel = mongoose.model("Tags", Tags);
