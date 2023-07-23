import mongoose, { Schema } from "mongoose";

const Information = new Schema({
  SiteTitle: { type: String, required: true },
  SiteSubtitle: { type: String, required: true },
  Currency: { type: Schema.Types.ObjectId, required: true },
});
const DeliverySchedule = new Schema({
  TitleTime: { type: String, required: true },
  Description: { type: String, required: true },
});
const SEO = new Schema({
  MetaTitle: { type: String },
  MetaDescription: { type: String },
  MetaTags: { type: String },
  CanonicalURL: { type: String },
  OGTitle: { type: String },
  OGDescription: { type: String },
  OGImage: { type: Schema.Types.ObjectId },
  TwitterHandle: { type: String },
  TwitterCardType: { type: String },
});
const ShopSettings = new Schema({
  Location: { Longtude: { type: String, required: true }, Attitude: { type: String, required: true } },
  ContactNumber: { type: String },
  Website: { type: String },
  SocialPlatforms: [{ paltform: { type: Schema.Types.ObjectId, required: true }, vlaue: { type: String, required: true } }],
});

const Setting = new Schema(
  {
    Id: { type: String, required: true, unique: true },
    Logo: { type: String },
    Information,
    SEO,
    DeliverySchedule,
    ShopSettings,
  },
  { timestamps: true, collection: "Setting" }
);

export const SettingModel = mongoose.model("Setting", Setting);
