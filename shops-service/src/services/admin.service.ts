import { MSGQ } from "../utils";
import { APIError, BadRequestError, MSGQError } from "../utils/app-errors";

export class adminService {
  private serviceName: string;
  constructor(private msgq: MSGQ) {
    this.serviceName = "ADMIN_SERVICE";
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

  private async RPCgetSocialMediaPlatforms(Ids: string[]) {
    const resData = await this.RPCcall("GetSocialMediaPlatforms", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCgetGroups(Ids: string[]) {
    const resData = await this.RPCcall("GetGroups", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCgetCategories(Ids: string[]) {
    const resData = await this.RPCcall("GetCategories", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCgetTags(Ids: string[]) {
    const resData = await this.RPCcall("GetTags", JSON.stringify({ Ids }));
    return resData;
  }

  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */

  private async RPCcheckIsSocialMediaPlatformsExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsSocioalMediaPlatformExist", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCcheckIsGroupsExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsGroupsExist", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCcheckIsCategoriesExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsCategoriesExist", JSON.stringify({ Ids }));
    return resData;
  }
  private async RPCcheckIsTagsExist(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsTagsExist", JSON.stringify({ Ids }));
    return resData;
  }

  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */

  async GroupsValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid Group id");
        }
      }
      const checkExist = await this.RPCcheckIsGroupsExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
  async CategoriesValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid Group id");
        }
      }
      const checkExist = await this.RPCcheckIsCategoriesExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
  async TagsValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid Group id");
        }
      }
      const checkExist = await this.RPCcheckIsTagsExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
  async SotialProfilesValidation(Ids: string[]) {
    if (Array.isArray(Ids) && Ids.length > 0) {
      for (let i = 0; i < Ids.length; i++) {
        if (!Ids[i]) {
          throw new BadRequestError(Ids[i] + " invalid SotialProfiles id");
        }
      }
      const checkExist = await this.RPCcheckIsSocialMediaPlatformsExist(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }

  async JoinSocialPaltforms(fields: any) {
    const Ids: any = [];
    for (let field of fields) {
      for (let SocialMediaPlatform of field.SocialProfiles) {
        Ids.push(SocialMediaPlatform.SocialMediaPlatform);
      }
    }
    const resfield = await this.RPCgetSocialMediaPlatforms(Ids);
    const fieldsResult = fields.map((field: any) => {
      const fieldObj = field.toObject();
      fieldObj.SocialProfiles = fieldObj.SocialProfiles.map((SocialProfile: any) => {
        SocialProfile.SocialMediaPlatform = resfield[SocialProfile.SocialMediaPlatform.toString()];
        return SocialProfile;
      });
      return fieldObj;
    });
    return fieldsResult;
  }
}
