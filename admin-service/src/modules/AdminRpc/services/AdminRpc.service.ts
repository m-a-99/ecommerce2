import { AdminRepository } from "../../../database";
import { BadRequestError } from "../../../utils/app-errors";

export class AdminRpcService {
  constructor(private repository: AdminRepository) {}

  async RPCDBAddNewFile() {}

  async RPCcheckIsSocioalMediaPlatformExist(Ids: any) {
    return await this.#CheckExist(Ids, "SocialMediasPlatform", async (Id: any) => await this.repository.getSocialMediaPlatformById(Id));
  }
  async RPCcheckIsTagsExist(Ids: any) {
    return await this.#CheckExist(Ids, "Tag", async (Id: any) => (await this.repository.getTagsByIds([Id]))[0]);
  }

  async RPCcheckIsGroupsExist(Ids: any) {
    return await this.#CheckExist(Ids, "Group", async (Id: any) => (await this.repository.getGroupsByIds([Id]))[0]);
  }
  async RPCcheckIsCategoriesExist(Ids: any) {
    // const resData = [];
    // for (let Id of Ids) {
    //   if (typeof Id !== "string") {
    //     resData.push({ Value: Id, Exist: false, message: Id + " invalid Category Id" });
    //   }
    //   try {
    //     const category = await this.repository.getCategoriesByIds([Id])[0];
    //     if (!category) {
    //       resData.push({ Value: Id, Exist: false, message: `Category with ${Id} Id dose not Exist` });
    //     } else {
    //       resData.push({ Value: Id, Exist: true });
    //     }
    //   } catch (e:any) {
    //     resData.push({ Value: Id, Exist: false, message: e.message });
    //   }
    // }
    return await this.#CheckExist(Ids, "Category", async (Id: any) => (await this.repository.getCategoriesByIds([Id]))[0]);
  }

  async RPCgetSocialMediaPlatformsByIds(Ids: any) {
    return this.#RPCGetbyIdsFormat(await this.repository.getSocialMediaPlatformsByIds(Ids));
  }

  async RPCgetTagsByIds(Ids: any) {
    return this.#RPCGetbyIdsFormat(await this.repository.getTagsByIds(Ids));
  }
  async RPCgetGroupsByIds(Ids: any) {
    return this.#RPCGetbyIdsFormat(await this.repository.getGroupsByIds(Ids));
  }
  async RPCgetCategoriesByIds(Ids: any) {
    return this.#RPCGetbyIdsFormat(await this.repository.getCategoriesByIds(Ids));
  }

  async #RPCGetbyIdsFormat(data: any) {
    const resData: any = {};
    data.forEach((v: any) => {
      resData[v._id] = v;
    });
    return resData;
  }
  async #CheckExist(Ids: any, FieldName: any, cb: any) {
    const resData: any[] = [];
    for (let Id of Ids) {
      if (typeof Id !== "string") {
        resData.push({ Value: Id, Exist: false, message: `${Id} invalid ${FieldName} Id` });
      }
      try {
        const Data = await cb(Id);
        if (!Data) {
          resData.push({ Value: Id, Exist: false, message: `${FieldName} with ${Id} Id dose not Exist` });
        } else {
          resData.push({ Value: Id, Exist: true });
        }
      } catch (e: any) {
        resData.push({ Value: Id, Exist: false, message: e.message });
      }
    }
    return resData;
  }

  async createFileSubscriber(file:any) {
    try {
      const { _id, Path, OriginalName, Mimetype, AccessType, AccessUsers } = file;
      const File=await this.repository.CreateFile(_id, Path, OriginalName, Mimetype, AccessType, AccessUsers);
      return File;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  
}
