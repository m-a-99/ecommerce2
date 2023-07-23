import mongoose,{Schema} from "mongoose";
mongoose.set("strictQuery", true);
const SocialProfile = new Schema({
  SocialMediaPlatform: { type: Schema.Types.ObjectId, required: true },
  Url: { type: String, required: true },
});

const Authors = new Schema(
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

export const AuthorsModel= mongoose.model("Authors", Authors);
