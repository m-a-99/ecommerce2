import { MSGQ } from "../../../utils";
import { productsRpcService } from "../services/productsRpc.service";

export class productsRpcController {
  constructor(private msgq: MSGQ, private service: productsRpcService) {
    this.init();
  }
  async init() {
    this.msgq.Rigester("CheckIsProductsExist", async (msg) => {
      const { Products } = JSON.parse(msg) || {};
      const resData = await this.service.RPCCheckIsProductsExist(Products);
      return resData;
    });
    this.msgq.Rigester("GetProductsByIds", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCGetProductsByIds(Ids);
      return resData;
    });

    this.msgq.Rigester("CheckIsProductsExistByIds", async (msg) => {
      const { Ids } = JSON.parse(msg) || {};
      const resData = await this.service.RPCCheckIsProductsExistByIds(Ids);
      return resData;
    });

    this.msgq.Rigester("GetShopProductsCountByIds", async (msg) => {
      const { Ids } = JSON.parse(msg);
      const resData = await this.service.RPCgetShopProductsCountByIds(Ids);
      return resData;
    });

    /****************************************************************************** */
    /****************************************************************************** */
    /****************************************************************************** */

    const listener = await this.msgq.createListener("DB-PRODCAST");

    this.msgq.on(listener, "Files.Create", async (msg) => {
      const data = JSON.parse(msg);
      const file = await this.service.createFileSubscriber(data);
    });
    this.msgq.on(listener, "Groups.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createGroupSubscriber(data);
    });
    this.msgq.on(listener, "Categories.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createCategorySubscriber(data);
    });

    this.msgq.on(listener, "Categories.Update", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.updateCategorySubscriber(data);
    });
    this.msgq.on(listener, "Icons.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createIconSubscriber(data);
    });
    this.msgq.on(listener, "Tags.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createTagSubscriber(data);
    });
    this.msgq.on(listener, "Tags.Update", async (msg) => {
      const data = JSON.parse(msg);
      await this.service.updateTagSubscriber(data);
    });
    this.msgq.on(listener, "SocialMediaPlatforms.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createSocialMediaPlatformSubscriber(data);
    });
    this.msgq.on(listener, "SocialMediaPlatforms.Update", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.updateSocialMediaPlatformSubscriber(data);
    });

    this.msgq.on(listener, "Authors.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createAuthorSubscriber(data);
    });
    this.msgq.on(listener,"Authors.Update",async (msg:string)=>{
      const data=JSON.parse(msg);
      await this.service.updateAuthorSubscriber(data);
    })
    this.msgq.on(listener, "Manufacturers.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createManufactureSubscriber(data);
    });
    this.msgq.on(listener, "Manufacturers.Update",async(msg:string)=>{
      const data= JSON.parse(msg)
      await this.service.updateManufactureSubscriber(data);
    });
    this.msgq.on(listener, "Attributes.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createAttributeSubscriber(data);
    });
    this.msgq.on(listener, "Attributes.Update", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.updateAttribuesSubscriber(data);
    });
    this.msgq.on(listener, "WishList.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createWishSubscriber(data);
    });
    this.msgq.on(listener, "WishList.Delete", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.deleteWishSubscriber(data);
    });
    this.msgq.on(listener, "Shops.Create", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.createShopsSubscriber(data);
    });
    this.msgq.on(listener, "Shops.Update", async (msg: string) => {
      const data = JSON.parse(msg);
      await this.service.updateShopsSubscriber(data);
    });
  }
}
