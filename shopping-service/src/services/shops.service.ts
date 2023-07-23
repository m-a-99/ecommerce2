import { MSGQ } from "../utils";
import { APIError, BadRequestError, MSGQError } from "../utils/app-errors";

export class shopsService {
  private serviceName: string;
  constructor(private msgq: MSGQ) {
    this.serviceName = "SHOPS_SERVICE";
  }
  private async RPCcall(procedure: string, msg: string, Maxtimeout = 10000) {
    try {
      const resData = await this.msgq.Call(this.serviceName, procedure, msg, Maxtimeout);
      if (resData.ok) {
        return resData.data;
      } else {
        throw new APIError(`RPC Call -- ${this.serviceName} - ${procedure} -- got error after call `, resData.message);
      }
    } catch (e: any) {
      throw new MSGQError(`RPC Call -- ${this.serviceName} - ${procedure} -- got error before call `, e.message);
    }
  }
  private async RPCgetAttributes(Ids: string[]) {
    const resData = await this.RPCcall("GetAttributes", JSON.stringify({ Ids }));
    return resData;
  }

  private async RPCgetAuthors(Ids: string[]) {
    const resData = await this.RPCcall("GetAuthors", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCgetManufacturers(Ids: string[]) {
    const resData = await this.RPCcall("GetManufacturers", JSON.stringify({ Ids }));
    return resData;
  }

  private async RPCgetShops(Ids: string[]) {
    const resData = await this.RPCcall("GetShops", JSON.stringify({ Ids }));
    return resData;
  }
  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */

  private async RPCcheckIsAttributesExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsAttributesExist", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCcheckIsManufacturersExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsManufacturersExist", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCcheckIsAuthorsExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsAuthorsExist", JSON.stringify({ Ids }));
    return resData;
  }
  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */

  async getShopsByIds(Ids:string[]){
    return await this.RPCgetShops(Ids)
  }
  async AttributesValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid Attribute id");
        }
      }
      const checkExist = await this.RPCcheckIsAttributesExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
  async ManufacturersValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid Manufacturer id");
        }
      }
      const checkExist = await this.RPCcheckIsManufacturersExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
  async AuthorsValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid Author id");
        }
      }
      const checkExist = await this.RPCcheckIsAuthorsExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
}
