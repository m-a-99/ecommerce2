import express from "express";
import cors from "cors";
import { ApiErrorHandler, uncaughtException } from "./utils/error-handler";
import { AdminApiModule } from "./modules/AdminApi/modules/AdminApi.module";
import { AdminRpcModule } from "./modules/AdminRpc/modules/AdminRpc.module";
import { MSGQ } from "./utils";
export async function expressApp(app:express.Application, msgq:MSGQ) {
  app.use(express.json());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  new AdminApiModule(app, msgq)
  new AdminRpcModule(msgq)
  app.use(ApiErrorHandler);
  uncaughtException();
  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.url} With ${req.method} Type Not Found`});
  });
}
