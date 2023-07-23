import { MSGQ } from "../utils";
import { APIError, BadRequestError, MSGQError } from "../utils/app-errors";

export class productsService {
  private serviceName: string;
  constructor(private msgq: MSGQ) {
    this.serviceName = "PRODUCT_SERVICE";
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

  private async RPCgetProducts(Ids: string[]) {
    const Products = await this.RPCcall("GetProductsByIds", JSON.stringify({ Ids }));
    return Products;
  }
  private async RPCcheckIsProductsExist(Products: any) {
    const resData = await this.RPCcall("CheckIsProductsExist", JSON.stringify({ Products }));
    return resData;
  }
  private async RPCcheckIsProductsExistByIds(Ids: string[]) {
    const resData = await this.RPCcall("CheckIsProductsExistByIds", JSON.stringify({ Ids }));
    return resData;
  }

  async ProductsValidation(Cart: any) {
    if (Cart && Cart.length > 0) {
      for (let i = 0; i < Cart.length; i++) {
        if (!Cart[i].ProductId || !Cart[i].ProductType || !(Cart[i].ProductType === "Simple" || (Cart[i].ProductType === "Variable" && Cart[i].VariableId))) {
          throw new BadRequestError(Cart[i] + " invalid Product ");
        }
      }
      const checkExist = await this.RPCcheckIsProductsExist(Cart);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }

  async productsByIdValidation(Ids: string[]) {
    if (Ids && Ids.length > 0) {
      const checkExist = await this.RPCcheckIsProductsExistByIds(Ids);
      for (let v of checkExist) {
        if (!v.Exist) {
          throw new BadRequestError(v.message);
        }
      }
    }
  }
  async getCartProductsByIds(Cart: any) {
    if (Cart && Cart.length > 0) {
      const ids: any = [];
      Cart.forEach((v: any) => {
        ids.push(v.ProductId);
      });
      const products = await this.RPCgetProducts(ids);
      return products;
    }
  }
  async getProductByIds(ids: string[]) {
    const products = await this.RPCgetProducts(ids);
    return products;
  }
}

