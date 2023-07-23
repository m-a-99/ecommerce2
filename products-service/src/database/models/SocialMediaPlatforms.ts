import mongoose, { Schema } from "mongoose";
export interface SocialMediaPlatformstype {
  Icon: string;
  Name: string;
}
const SocialMediaPlatforms = new Schema<SocialMediaPlatformstype>(
  {
    Icon: { type: String, required: true },
    Name: { type: String, required: true },
  },
  { timestamps: true, collection: "SocialMediaPlatforms" }
);

export const SocialMediaPlatformsModel = mongoose.model("SocialMediaPlatforms", SocialMediaPlatforms);
