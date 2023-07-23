import mongoose, { Schema } from "mongoose";
mongoose.set("strictQuery", true);
export interface SubCategoriesType {
  _id?: mongoose.Types.ObjectId;
  Name: string;
  Details: string;
  Icon: string;
}
export interface CategoriesType {
  Name: string;
  Details: string;
  Icon: mongoose.Types.ObjectId;
  Group: mongoose.Types.ObjectId;
  SubCategories: SubCategoriesType[];
}

const SubCategories = new Schema<SubCategoriesType>({
  Name: { type: String, required: true },
  Details: { type: String, default: "" },
  Icon: { type: String, required: true },
});
const Categories = new Schema<CategoriesType>(
  {
    Name: { type: String, required: true },
    Details: { type: String, default: "" },
    Icon: { type: Schema.Types.ObjectId, required: true },
    Group: { type: Schema.Types.ObjectId, required: true },
    SubCategories: [SubCategories],
  },
  { timestamps: true, collection: "Categories" }
);

export const CategoriesModel = mongoose.model("Categories", Categories);
