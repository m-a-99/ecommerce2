import express from "express";
import { MSGQ } from "../../../utils";
import { ShopsRepository } from "../../../database";
import { shopsApiRemoteServic } from "../services/shopsApi.remote.service";
import { shopsApiService } from "../services/shopsApi.service";
import { shopsApiConroller } from "../controllers/shopsApi.controller";
import { usersService } from "../../../services/users.service";
import { filesService } from "../../../services/files.service";
import { adminService } from "../../../services/admin.service";
import { productsService } from "../../../services/products.service";
export class shopsApiModule{
    constructor(app:express.Application,msgq:MSGQ){
        const repository=new ShopsRepository();
        const remoteservice=new shopsApiRemoteServic(msgq);
        const users_service= new usersService(msgq);
        const admin_service=new adminService(msgq);
        const files_service=new filesService(msgq);
        const products_servcie=new productsService(msgq);
        const service = new shopsApiService(repository, remoteservice, users_service, admin_service, files_service, products_servcie);
        const controller =new shopsApiConroller(app,service);
    }
}