import mongoose,{Schema} from "mongoose";
mongoose.set("strictQuery", true);

const CartItem = new Schema({
  ProductId: { type: Schema.Types.ObjectId, required: true },
  ProductType: { type: String, values: ["Simple", "Varible"], required: true },
  VariableId: { type: Schema.Types.ObjectId },
  Quantity: { type: Number, required: true },
});
const ShoppingSession = new Schema(
  {
    Cart: [CartItem],
    UserId: { type: Schema.Types.ObjectId,required:true},
    IsOpened:{type:Boolean,required:true}
  },
  { timestamps: true, collection: "ShoppingSession" }
);

export const ShoppingSessionModel = mongoose.model("ShoppingSession", ShoppingSession);