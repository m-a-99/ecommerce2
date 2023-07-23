import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);

export interface SocialProfileType {
  SocialMediaPlatform: mongoose.Types.ObjectId;
  Url: string;
}
export interface Authors {
  Image?: string;
  Name: string;
  Languages?: string;
  Bio: string;
  Quote: string;
  Born?: string;
  Death?: string;
  SocialProfiles: SocialProfileType[];
}

const SocialProfile = new Schema<SocialProfileType>({
  SocialMediaPlatform: { type: Schema.Types.ObjectId, required: true },
  Url: { type: String, required: true },
});

const Authors = new Schema<Authors>(
  {
    Image: { type: String },
    Name: { type: String, required: true },
    Languages: { type: String },
    Bio: { type: String, default: "" },
    Quote: { type: String, default: "" },
    Born: { type: String },
    Death: { type: String },
    SocialProfiles: [SocialProfile],
  },
  { timestamps: true, collection: "Authors" }
);

export const AuthorsModel = mongoose.model("Authors", Authors);
