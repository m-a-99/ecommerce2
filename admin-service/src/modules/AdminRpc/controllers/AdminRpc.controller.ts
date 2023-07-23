// import { EXCHANGE_NAME, SERVICE_NAME } from "";
// import { RPCService } from "../service/RPC-Service";
// import { rpcres } = from "../utils";

import { MSGQ } from "../../../utils";
import { AdminRpcService } from "../services/AdminRpc.service";

export class AdminRpcConroller {
  constructor(private msgq: MSGQ, private service: AdminRpcService) {
    this.init()
  }

  async init() {
    const listener = await this.msgq.createListener("DB-PRODCAST");
    
    this.msgq.on(listener, "Files.Create", async (msg) => {
      const data = JSON.parse(msg);
      const file = await this.service.createFileSubscriber(data);
      console.log(file);
    });

    this.msgq.Rigester("CheckIsSocioalMediaPlatformExist", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCcheckIsSocioalMediaPlatformExist(Ids);
      return resData;
    });
    this.msgq.Rigester("CheckIsGroupsExist", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCcheckIsGroupsExist(Ids);
      return resData;
    });
    this.msgq.Rigester("CheckIsCategoriesExist", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCcheckIsCategoriesExist(Ids);
      return resData;
    });
    this.msgq.Rigester("CheckIsTagsExist", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCcheckIsTagsExist(Ids);
      return resData;
    });

    this.msgq.Rigester("GetSocialMediaPlatforms", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCgetSocialMediaPlatformsByIds(Ids);
      return resData;
    });
    
    this.msgq.Rigester("GetGroups", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCgetGroupsByIds(Ids);
      return resData;
    });

    this.msgq.Rigester("GetCategories", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCgetCategoriesByIds(Ids);
      return resData;
    });

    this.msgq.Rigester("GetTags", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCgetTagsByIds(Ids);
      return resData;
    });
  }
}
