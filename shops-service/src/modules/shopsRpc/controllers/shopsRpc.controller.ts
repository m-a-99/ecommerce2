import { MSGQ } from "../../../utils";
import { shopsRpcService } from "../services/shopsRpc.service";

export class shopsRpcController {
  constructor(private service: shopsRpcService, private msgq: MSGQ) {
    this.init();
  }
  init() {
    
    this.msgq.Rigester("CheckIsAttributesExist", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCcheckIsAttributesExist(Ids);
      return resData;
    });

    this.msgq.Rigester("CheckIsManufacturersExist", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCcheckIsManufacturersExist(Ids);
      return resData;
    });
    this.msgq.Rigester("CheckIsAuthorsExist", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCcheckIsAuthorsExist(Ids);
      return resData;
    });

    this.msgq.Rigester("CheckIsShopsExist",async(msg)=>{
      const {Ids}=JSON.parse(msg)||{}
      const resData=await this.service.PRCcheckIsShopsExist(Ids);
      return resData
    });

    this.msgq.Rigester("GetAttributes", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCgetAttributesByIds(Ids);
      return resData;
    });
    this.msgq.Rigester("GetManufacturers", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCgetManufacturersByIds(Ids);
      return resData;
    });
    this.msgq.Rigester("GetAuthors", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCgetAuthorsByIds(Ids);
      return resData;
    });

    this.msgq.Rigester("GetShops",async(msg)=>{
      const {Ids}=JSON.parse(msg)||{};
      const resData = await this.service.RPCgetShopsByIds(Ids);
      return resData
    });
  }
}
