import mongoose from "mongoose"
import { APIError } from "../utils/app-errors"

export const DBconnect = async (DB_URL:string) => {
    try {
        mongoose.connect(DB_URL)
    } catch (e:any) {
        throw new APIError("db connection error",e.message)
    }
}