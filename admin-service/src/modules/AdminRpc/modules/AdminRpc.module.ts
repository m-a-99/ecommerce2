import { AdminRepository } from "../../../database";
import { MSGQ } from "../../../utils";
import { AdminRpcConroller } from "../controllers/AdminRpc.controller";
import { AdminRpcService } from "../services/AdminRpc.service";

export class AdminRpcModule {
  constructor(private msgq:MSGQ) {
    this.init()
  }
  init() {
    const repository=new AdminRepository();
    const service = new AdminRpcService(repository);
    new AdminRpcConroller(this.msgq, service);
  }
}
