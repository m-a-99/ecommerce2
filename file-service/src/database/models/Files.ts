import mongoose, {Schema} from "mongoose"
mongoose.set('strictQuery', true);

const Files = new Schema({
    Path: { type: String, required: true },
    Mimetype: { type: String, required: true },
    OriginalName: { type: String, required: true },
    AccessType: { type: String, values: ["public", "private"], message:"{AccessType} is an invalid Access Type", required: true },
    AccessUsers: [Schema.Types.ObjectId]
}, { timestamps: true, collection: "Files" })


export const model=mongoose.model("Files",Files);