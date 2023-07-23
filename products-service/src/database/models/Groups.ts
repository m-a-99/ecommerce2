import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

export interface BannerType{
  Title: string
  Description:string
  Banner: string
};

export interface GroupsType {
  Name: string;
  Icon: mongoose.Types.ObjectId;
  Layout: mongoose.Types.ObjectId;
  ProductCard: mongoose.Types.ObjectId;
  PromotionalSliders: String[];
  Banners: BannerType[];
}

const Banner = new Schema<BannerType>({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Banner: { type: String, required: true },
});

const Groups = new Schema<GroupsType>(
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
