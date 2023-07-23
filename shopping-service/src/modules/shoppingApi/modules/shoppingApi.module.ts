import { ShoppingRepository } from "../../../database/repository/shopping-repository";
import { MSGQ } from "../../../utils";
import express from "express";
import { shoppingApiRemoteService } from "../services/shoppingApi.remote.service";
import { shoppingApiService } from "../services/shoppingApi.service";
import { shoppingApiController } from "../controllers/shoppingApi.controller";
import { productsService } from "../../../services/products.service";
import { usersService } from "../../../services/users.service";
import { shopsService } from "../../../services/shops.service";
export class shoppingApiModule {
    constructor(app:express.Application,msgq:MSGQ){
        const repository = new ShoppingRepository();
        const remoteService = new shoppingApiRemoteService(msgq);
        const users_service=new usersService(msgq);
        const products_service=new productsService(msgq);
        const shops_service=new shopsService(msgq);
        const service = new shoppingApiService(repository, remoteService, users_service, products_service, shops_service);
        const controller=new shoppingApiController(app,service);
    }
}