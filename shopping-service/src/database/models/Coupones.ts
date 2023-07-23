import mongoose,{Schema} from "mongoose";
mongoose.set("strictQuery", true);

const Coupones=new Schema({
    Image:{type:Schema.Types.ObjectId},
    Code:{types:String,required:true},
    Description:{type:String,default:""},
    Amount:{type:Number,required:true},
    ActiveFrom:{type:Date,required:true},
    WillExpire:{type:Date,required:true}

}, { timestamps: true, collection:"Coupones"});

export const CouponesModel = mongoose.model("Coupones", Coupones);