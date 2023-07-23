import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

const SocialProfile = new Schema({
  SocialMediaPlatform: { type: Schema.Types.ObjectId, required: true },
  Url: { type: String, required: true },
});

const Manufacturers = new Schema(
  {
    Logo: { type: String },
    CoverImage: { type: String },
    ShopId: { type: Schema.Types.ObjectId, required: true },
    Name: { type: String, required: true },
    Website: { type: String, required: true },
    Description: { type: String, default: "" },
    Group: { type: Schema.Types.ObjectId, required: true },
    SocialProfiles: [SocialProfile],
  },
  { timestamps: true, collection: "Manufacturers" }
);

export const ManufacturersModel = mongoose.model("Manufacturers", Manufacturers);
