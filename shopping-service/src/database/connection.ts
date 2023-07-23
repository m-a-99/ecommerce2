import mongoose from "mongoose"
const { APIError } = require('../utils/app-errors')
export async function DBconnect(DB_URL:string){
    try{
        await mongoose.connect(DB_URL)
    }
    catch(e:any){
        throw new APIError("db connection error",e.message)
    }
}
