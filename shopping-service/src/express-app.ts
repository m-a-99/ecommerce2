import cors from "cors";
import express from "express";
import { ApiErrorHandler, uncaughtException } from "./utils/error-handler";
import { MSGQ } from "./utils";
import { shoppingApiModule } from "./modules/shoppingApi/modules/shoppingApi.module";
export  async function expressApp(app:express.Application,msgq:MSGQ){
    app.use(cors());
    app.use(express.json())
    app.use(ApiErrorHandler)
    new shoppingApiModule(app,msgq);
    uncaughtException()
    app.use((req, res) => {
      res.status(404).json({ message: `Route ${req.url} With ${req.method} Type Not Found` });
    });
}

