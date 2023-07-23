import express from "express"
import cors from "cors"
import { ApiErrorHandler, uncaughtException } from "./utils/error-handler";
import { shopsApiModule } from "./modules/shopsApi/modules/shopsApi.module";
import { MSGQ } from "./utils";
import { shopsRpcModule } from "./modules/shopsRpc/modules/shopsRpc.module";

export async function expressApp(app:express.Application,msgq:MSGQ){
    app.use(cors())
    app.use(express.json());
    app.use(express.static(__dirname+"/public"))
    new shopsApiModule(app,msgq);
    new shopsRpcModule(msgq);
    app.use(ApiErrorHandler)
    uncaughtException()
    app.use((req:any, res:any) => {
      res.status(404).json({ message: `Route ${req.url} With ${req.method} Type Not Found` });
    });
}
