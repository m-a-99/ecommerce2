import mongoose,{Schema} from "mongoose"
mongoose.set('strictQuery', true);

const SubCategories = new Schema({
  Name: { type: String, required: true },
  Details: { type: String, default: "" },
  Icon: { type: String, required: true },
});

const Categories = new Schema(
  {
    Name: { type: String, required: true },
    Details: { type: String, default: "" },
    Icon: { type: Schema.Types.ObjectId, required: true },
    Group: { type: Schema.Types.ObjectId, required: true },
    SubCategories: [SubCategories],
  },
  { timestamps: true, collection: "Categories" }
);

export const CategoriesModel= mongoose.model("Categories", Categories);