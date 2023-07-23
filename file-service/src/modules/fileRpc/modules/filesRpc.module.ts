import { FilesRepository } from "../../../database/repository/Files-Repository";
import { MSGQ } from "../../../utils";
import { fileRpcController } from "../controllers/filesRpc.controller";
import { filesRpcService } from "../services/filesRpc.service";

export class fileRpcModule{
    constructor(msgq:MSGQ){
        const repository=new FilesRepository()
        const service = new filesRpcService(repository);
        const controller = new fileRpcController(service,msgq);
    }
}