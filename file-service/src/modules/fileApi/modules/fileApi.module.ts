import express from "express";
import { MSGQ } from "../../../utils";
import { fileApiServices } from "../services/fileApi.service";
import { FilesRepository } from "../../../database/repository/Files-Repository";
import { fileApiController } from "../controllers/fileApi.controller";
import { fileApiRemoteServices } from "../services/fileApi.remote.service";
import { usersService } from "../../../services/users.service";
export class fileApiModule {
  constructor(private app: express.Application, msgq: MSGQ) {
    const repository = new FilesRepository();
    const remoteService = new fileApiRemoteServices(msgq);
    const users_service=new usersService(msgq);
    const service = new fileApiServices(repository, remoteService, users_service);
    const controller = new fileApiController(app, msgq, service);
  }
}
