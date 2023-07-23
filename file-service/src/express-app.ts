import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser";
import { MSGQ } from "./utils";
import { fileApiModule } from "./modules/fileApi/modules/fileApi.module";
import { ApiErrorHandler, uncaughtException } from "./utils/error-handler";
import { fileRpcModule } from "./modules/fileRpc/modules/filesRpc.module";
export async function expressApp(app:express.Application,msgq:MSGQ){
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static(__dirname+"/public"));
    new fileApiModule(app,msgq)
    new fileRpcModule(msgq);
    app.use(ApiErrorHandler);
    uncaughtException();
    app.use((req, res) => {
      res.status(404).json({ message: `Route ${req.url} With ${req.method} Type Not Found` });
    });
}
module.exports = { expressApp }