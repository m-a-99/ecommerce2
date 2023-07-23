import mongoose, {Schema} from "mongoose"
mongoose.set('strictQuery', true);

export interface FilesType {
  Path: string;
  Mimetype: string;
  OriginalName: string;
  AccessType: string;
  AccessUsers: mongoose.Types.ObjectId[];
}
const Files = new Schema<FilesType>(
  {
    Path: { type: String, required: true },
    Mimetype: { type: String, required: true },
    OriginalName: { type: String, required: true },
    AccessType: { type: String, values: ["public", "private"], message: "{AccessType} is an invalid Access Type", required: true },
    AccessUsers: [Schema.Types.ObjectId],
  },
  { timestamps: true, collection: "Files" }
);


export const FilesModel = mongoose.model("Files", Files);