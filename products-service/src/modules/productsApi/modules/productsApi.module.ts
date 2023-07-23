import express from "express";
import { productsApiService } from "../services/productsApi.service";
import { productsApiRemoteService } from "../services/productsApi.remote.service";
import { MSGQ } from "../../../utils";
import { productApiController } from "../controllers/productsApi.controller";
import { usersService } from "../../../services/users.service";
import { adminService } from "../../../services/admin.service";
import { filesService } from "../../../services/files.service";
import { shopsService } from "../../../services/shops.service";

export class productApiModule{
    constructor(app:express.Application,msgq:MSGQ){
        const remoteService = new productsApiRemoteService(msgq);
        const users_service=new usersService(msgq);
        const admin_service=new adminService(msgq);
        const files_service=new filesService(msgq);
        const shops_service=new shopsService(msgq);
        const service = new productsApiService(remoteService, users_service,admin_service,files_service,shops_service);
        new productApiController(app,service);
    }
}