import express from "express"
import { DBconnect } from "./database";
import { MSGQ } from "./utils";
import { DB_URL, EXCHANGE_NAME, MSG_QUEUE_URL, PORT, SERVICE_NAME } from "./config";
import { expressApp } from "./express-app";
import { APIError } from "./utils/app-errors";

async function RunServer(){
    await DBconnect(DB_URL);
    const msgq=new MSGQ();
    await msgq.init(MSG_QUEUE_URL,EXCHANGE_NAME,SERVICE_NAME);
    const app=express();
    expressApp(app,msgq)
    app.listen(PORT,()=>{
        console.log("server running on port "+ PORT)
    }).on("error", async (err) => {
        await MSGQ.channel.close();
        throw new APIError("listen error ", err.message)
    }).on("close",async ()=>{
        await MSGQ.channel.close();
    })
}

RunServer();