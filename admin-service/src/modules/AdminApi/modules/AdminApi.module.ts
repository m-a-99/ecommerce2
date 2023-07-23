import { AdminRepository } from "../../../database";
import { MSGQ } from "../../../utils";
import { RemoteService } from "../services/AdminApi.remote.service";
import { AdminApiService } from "../services/AdminApi.service";
import { AdminApiConroller} from "../controllers/AdminApi.controller"
import express from "express"
import { filesService } from "../../../services/files.service";
import { usersService } from "../../../services/users.service";
export class AdminApiModule {
  constructor(app:express.Application, msgq:MSGQ) {
    const repository = new AdminRepository();
    const remoteService = new RemoteService(msgq);
    const files_service = new filesService(msgq);
    const users_service=new usersService(msgq);
    const service = new AdminApiService(repository, remoteService, users_service, files_service);
    const controller = new AdminApiConroller(app, service);  
  }
}
