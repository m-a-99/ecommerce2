import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

const Banner = new Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Banner: { type: String, required: true },
});

const Groups = new Schema(
  {
    Name: { type: String, required: true },
    Icon: { type: Schema.Types.ObjectId, required: true },
    Layout: { type: Schema.Types.ObjectId, required: true },
    ProductCard: { type: Schema.Types.ObjectId, required: true },
    PromotionalSliders: [String],
    Banners: [Banner],
  },
  { timestamps: true, collection: "Groups" }
);

export const GroupsModel = mongoose.model("Groups", Groups);
