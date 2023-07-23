import { MSGQ } from "../utils";
import { APIError, BadRequestError, MSGQError } from "../utils/app-errors";


export class filesService {
  private serviceName: string;
  constructor(private msgq: MSGQ) {
    this.serviceName = "FILE_SERVICE";
  }

  private async RPCcall(service: string, procedure: string, msg: string, Maxtimeout = 10000) {
    try {
      const resData = await this.msgq.Call(service, procedure, msg, Maxtimeout);
      if (resData.ok) {
        return resData.data;
      } else {
        throw new APIError(`RPC Call -- ${service} - ${procedure} -- got error after call `, resData.message);
      }
    } catch (e: any) {
      throw new MSGQError(`RPC Call -- ${service} - ${procedure} -- got error before call `, e.message);
    }
  }

  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */
  async CreateUploadUrl(Feilds: any) {
    const resData = await this.RPCcall(this.serviceName, "CreateUplpoadUrl", JSON.stringify(Feilds));
    return resData;
  }
  
  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */
  async FilesValidation(FilesUrlsOrIds: string[]) {
    const resData = await this.RPCcall("FILE_SERVICE", "CheckisFilesExist", JSON.stringify({ FilesUrlsOrIds }));
    const Files = resData.Files;
    for (const f in Files) {
      if (!Files[f].Exist) {
        throw new BadRequestError(`invalid ${f} file , ${Files[f].message}`);
      }
    }
  }
}
