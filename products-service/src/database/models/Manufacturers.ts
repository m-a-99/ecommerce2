import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

export interface SocialProfileType {
  SocialMediaPlatform: mongoose.Types.ObjectId;
  Url: string;
}

export interface ManufacturersType {
  Logo: string;
  CoverImage: string;
  Name: string;
  Website: string;
  Description: string;
  Group: mongoose.Types.ObjectId;
  SocialProfiles: SocialProfileType[];
}
const SocialProfile = new Schema<SocialProfileType>({
  SocialMediaPlatform: { type: Schema.Types.ObjectId, required: true },
  Url: { type: String, required: true },
});

const Manufacturers = new Schema<ManufacturersType>(
  {
    Logo: { type: String },
    CoverImage: { type: String },
    Name: { type: String, required: true },
    Website: { type: String, required: true },
    Description: { type: String, default: "" },
    Group: { type: Schema.Types.ObjectId, required: true },
    SocialProfiles: [SocialProfile],
  },
  { timestamps: true, collection: "Manufacturers" }
);

export const ManufacturersModel = mongoose.model("Manufacturers", Manufacturers);
