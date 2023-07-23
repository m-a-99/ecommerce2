import mongoose,{Schema} from "mongoose";
mongoose.set("strictQuery", true);

const Local=new Schema({
    Country: { type: Schema.Types.ObjectId, required: true },
    State: { type: Schema.Types.ObjectId, required: true },
    ZIP: { type: String, required: true }
})

const Tax=new Schema({
    Name:{type:String,required:true},
    Global:{type:Boolean,default:false},
    Rate:{type:Number,default:0},
    Local
},{timestamps:true,collection:"Tax"});

export const TaxModel = mongoose.model("Tax", Tax);