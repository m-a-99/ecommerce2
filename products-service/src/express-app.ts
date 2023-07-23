import express from "express";
import cors from "cors";
import { ApiErrorHandler, uncaughtException } from "./utils/error-handler";
import { productApiModule } from "./modules/productsApi/modules/productsApi.module";
import { MSGQ } from "./utils";
import { productsRpcModule } from "./modules/productsRpc/modules/productsRpc.module";
export async function expressApp (app:express.Application,msgq:MSGQ){
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname+"/public"));
    new productApiModule(app,msgq)
    new productsRpcModule(msgq);
    app.use(ApiErrorHandler)
    uncaughtException()
    app.use((req, res) => {
      res.status(404).json({ message: `Route ${req.url} With ${req.method} Type Not Found` });
    });
}

