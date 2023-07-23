import { UserRepository } from "../../../database";
import { filesService } from "../../../services/files.service";
import { MSGQ } from "../../../utils";
import { userApiController } from "../controllers/userApi.controller";
import { userApiRemoteService } from "../services/userApi.remote.service";
import { userApiService } from "../services/userApi.service";
import express from "express";
export class userApiModule {
  constructor(private app: express.Application, private msgq: MSGQ) {
    const repository = new UserRepository();
    const remoteservice=new userApiRemoteService(msgq);
    const files_service=new filesService(msgq);
    const service = new userApiService(repository, remoteservice,files_service);
    const remoteService = new userApiRemoteService(msgq);
    new userApiController(app,service,remoteService)
  }
}
