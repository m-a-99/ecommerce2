import express from "express";
import cors from "cors"
import { userApiModule } from "./modules/userApi/modules/userApi.module";
import { MSGQ } from "./utils";
import { userRpcModule } from "./modules/userRpc/modules/userRpc.module";
import { ApiErrorHandler, uncaughtException } from "./utils/error-handler";
export async function expressApp(app:express.Application,msgq:MSGQ){
    app.use(express.json())
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    new userApiModule(app,msgq)
    new userRpcModule(msgq)
    app.use(ApiErrorHandler)
    uncaughtException()
    app.use((req:any, res:any)=>{
      res.status(404).json({ message: `Route ${req.url} With ${req.method} Type Not Found` });
    });
}