import mongoose, { Schema } from "mongoose";

const WishList = new Schema({
    UserId:{type:Schema.Types.ObjectId,required:true},
    ProductId:{type:Schema.Types.ObjectId,required:true}
}, { timestamps: true, collection: "WishList" });


export const WishListModel = mongoose.model("WishList", WishList);