import mongoose from "mongoose";
import { ErrorLogger } from "../utils/error-handler";
import { APIError } from "../utils/app-errors";

mongoose.set('strictQuery', true);

export const DBconnect =async(DB_URL:string)=>{
    try{
        await mongoose.connect(DB_URL);
    }
    catch(e:any){
        const errorloger = new ErrorLogger()
        errorloger.logError(new APIError("db connection error", e.message, 500, false));
        process.exit(1)
    }
}