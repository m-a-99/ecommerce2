import mongoose, { Schema } from "mongoose";

const SocialMediaPlatforms = new Schema(
  {
    Icon: { type: String, required: true },
    Name: { type: String, required: true },
  },
  { timestamps: true, collection: "SocialMediaPlatforms" }
);

export const SocialMediaPlatformsModel = mongoose.model("SocialMediaPlatforms", SocialMediaPlatforms);
