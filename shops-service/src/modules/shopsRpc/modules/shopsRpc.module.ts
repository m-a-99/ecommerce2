import { ShopsRepository } from "../../../database";
import { MSGQ } from "../../../utils";
import { shopsRpcController } from "../controllers/shopsRpc.controller";
import { shopsRpcService } from "../services/shopsRpc.service";

export class shopsRpcModule{
    constructor(msgq:MSGQ){
        const repository=new ShopsRepository();
        const service=new shopsRpcService(repository,msgq);
        const controller=new shopsRpcController(service,msgq);
    }
}