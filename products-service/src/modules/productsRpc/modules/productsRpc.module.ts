import { MSGQ } from "../../../utils";
import { productsApiRemoteService } from "../../productsApi/services/productsApi.remote.service";
import { productsRpcController } from "../controllers/productsRpc.controller";
import { productsRpcService } from "../services/productsRpc.service";

export class productsRpcModule{
    constructor(msgq:MSGQ){
        const remoteService=new productsApiRemoteService(msgq)
        const service = new productsRpcService(remoteService);
        new productsRpcController(msgq,service)
    }
}