import { DB_URL, EXCHANGE_NAME, MSG_QUEUE_URL, PORT, SERVICE_NAME } from "./config";
import express from "express";
import { MSGQ } from "./utils";
import { expressApp } from "./express-app";
import { DBconnect } from "./database";

async function RunServer(){
    await DBconnect(DB_URL);
    const app=express();
    const msgq=new MSGQ();
    await msgq.init(MSG_QUEUE_URL,EXCHANGE_NAME,SERVICE_NAME);
    
    await expressApp(app,msgq);
    app.listen(PORT,()=>{
        console.log("app listen on PORT "+PORT);
    }).on("err",(e)=>{
        console.log(e);
        process.exit(0);
    }).on("close",()=>{
        MSGQ.channel.close();
    })
}
RunServer();