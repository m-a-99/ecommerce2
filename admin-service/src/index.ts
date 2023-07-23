import express from 'express';
import { DB_URL, PORT, MSG_QUEUE_URL,EXCHANGE_NAME, SERVICE_NAME } from './config';
import { DBconnect } from './database';
import {  expressApp } from './express-app';
import { APIError } from './utils/app-errors';
import { MSGQ } from './utils';

async function RunServer(){
    await DBconnect(DB_URL);
    const app=express();
    const msgq=new MSGQ()
    await msgq.init(MSG_QUEUE_URL, EXCHANGE_NAME, SERVICE_NAME);
    expressApp(app, msgq );    
    app.listen(PORT,()=>{
        console.log("server runing on port "+ PORT);
    }).on("error",async (e)=>{
        await MSGQ.channel.close();
        throw new APIError("failed to listent to port "+PORT,e.message)
    }).on("close",async ()=>{
        await MSGQ.channel.close();
    })
}
RunServer();