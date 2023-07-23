import mongoose, { Schema } from "mongoose";
export interface WishListType {
  UserId:  Schema.Types.ObjectId;
  ProductId:  Schema.Types.ObjectId;
}
const WishList = new Schema<WishListType>(
  {
    UserId: { type: Schema.Types.ObjectId, required: true },
    ProductId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, collection: "WishList" }
);


export const WishListModel = mongoose.model("WishList", WishList);