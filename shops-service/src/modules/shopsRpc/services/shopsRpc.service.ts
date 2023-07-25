import { ShopsRepository } from "../../../database/repository/Shops-Repository";
import { ArrToObj, MSGQ } from "../../../utils";

export class shopsRpcService {
  constructor(private repository: ShopsRepository, private msgq: MSGQ) {}
  async RPCgetAttributesByIds(Ids: string[]) {
    return ArrToObj(await this.repository.getAttributesByIds(Ids), "_id");
  }
  async RPCgetManufacturersByIds(Ids: string[]) {
    return ArrToObj(await this.repository.getManufacturersByIds(Ids), "_id");
  }
  async RPCgetAuthorsByIds(Ids: string[]) {
    return ArrToObj(await this.repository.getAuthorsByIds(Ids), "_id");
  }
  async RPCgetShopsByIds(Ids: string[]) {
    return ArrToObj(await this.repository.getShopsByIds(Ids), "_id");
  }
  async RPCgetShopsByOwnersIds(Ids: string[]) {
    return ArrToObj(await this.repository.getShopsByOwnersIds(Ids), "_id");
  }

  async RPCcheckIsAttributesExist(Ids: string[]) {
    return await this.#CheckExist(Ids, "Attribute", async (Ids: string[]) => await this.repository.getAttributesByIds(Ids));
  }
  async RPCcheckIsManufacturersExist(Ids: string[]) {
    return await this.#CheckExist(Ids, "Manufacturer", async (Ids: string[]) => await this.repository.getManufacturersByIds(Ids));
  }
  async RPCcheckIsAuthorsExist(Ids: string[]) {
    return await this.#CheckExist(Ids, "Author", async (Ids: string[]) => await this.repository.getAuthorsByIds(Ids));
  }

  async PRCcheckIsShopsExist(Ids: string[]) {
    return await this.#CheckExist(Ids, "Shop", async (Ids: string[]) => await this.repository.getShopsByIds(Ids));
  }

  async #CheckExist(Ids: string[], FieldName: string, cb: any) {
    const resData: any[] = [];
    const _Ids = Ids.map((Id: string) => {
      if (typeof Id !== "string") {
        resData.push({ Value: Id, Exist: false, message: `${Id} invalid ${FieldName} Id` });
      } else {
        return Id;
      }
    });
    const Data = ArrToObj(await cb(_Ids), "_id");

    for (let Id of _Ids) {
      try {
        if (!Data[Id || ""]) {
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
}
