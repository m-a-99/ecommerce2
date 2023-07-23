import { MSGQ } from "../utils";
import { APIError, MSGQError } from "../utils/app-errors";

export class usersService {
  private serviceName: string;
  constructor(private msgq: MSGQ) {
    this.serviceName = "USER_SERVICE";
  }

  private async RPCcall(service: string, procedure: string, msg: string, Maxtimeout = 10000) {
    try{
        const resData = await this.msgq.Call(service, procedure, msg, Maxtimeout);
        if (resData.ok) {
          return resData.data;
        } else {
          throw new APIError(`RPC Call -- ${service} - ${procedure} -- got error after call `, resData.message);
        }
    }catch(e:any){
        throw new MSGQError(`RPC Call -- ${service} - ${procedure} -- got error `, e.message);
    }
  }

  private async RPCcheckAuth(token: string) {
    const resData = await this.RPCcall(this.serviceName, "CheckAuth", JSON.stringify({ token }));
    return resData;
  }

  async checkAuth(token: string) {
    return await this.RPCcheckAuth(token);
  }
}