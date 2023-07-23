import { MSGQ } from "../../../utils";
import { userRpcController } from "../controllers/userRpc.controller";
import { userRpcService } from "../services/userRpc.service";

export class userRpcModule{
    constructor(private msgq:MSGQ){
        const service=new userRpcService()
        new userRpcController(msgq,service)
    }
}