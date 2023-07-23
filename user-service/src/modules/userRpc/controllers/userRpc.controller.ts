import { MSGQ } from "../../../utils";
import { userRpcService } from "../services/userRpc.service";

export class userRpcController {
  constructor(private msgq: MSGQ, private service: userRpcService) {
    this.init();
  }
  init() {
    this.msgq.Rigester("CheckAuth", async (msg) => {
      const { token } = JSON.parse(msg);
      const user = await this.service.ResolveUserByToken(token);
      return user;
    });
    this.msgq.Rigester("GetUsersByIds",async(msg)=>{
      const {Ids}=JSON.parse(msg);
      const users=await this.service.GetUsersByIds(Ids);
      return users;
    })
  }
}
