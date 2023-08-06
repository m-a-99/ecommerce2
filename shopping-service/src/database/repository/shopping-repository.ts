import mongoose, { Collection, Model } from "mongoose";
import { APIError, BadRequestError } from "../../utils/app-errors";
import { OrdersModel, ShippingsModel, ShoppingSessionModel, WishListModel } from "../models";
import { OrderStatusModel } from "../models/OrderStatus";

export class ShoppingRepository {
  // async getSessionById(SessionId: string) {
  //   try {
  //     try {
  //       const session = await ShoppingSessionModel.findById(SessionId);
  //       if (session) {
  //         return session;
  //       } else throw new BadRequestError("session not found");
  //     } catch (e: any) {
  //       const newSession = new ShoppingSessionModel();
  //       await newSession.save();
  //       return newSession;
  //     }
  //   } catch (e: any) {
  //     throw new BadRequestError(e.message);
  //   }
  // }
  async getUserSession(userId: string) {
    try {
      const session = await ShoppingSessionModel.find({ UserId: userId }).sort({ _id: -1 }).limit(1);
      if (session[0]?.IsOpened) {
        return session[0];
      } else {
        const newSession = new ShoppingSessionModel({
          IsOpened: true,
          UserId: userId,
        });
        await newSession.save();
        return newSession;
      }
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async closeSession(SessionId: string) {
    const session = await ShoppingSessionModel.findById(SessionId);
    if (session) {
      session.IsOpened = false;
      await session.save();
    }

    return session;
  }

  // async createSession(SessionId: string) {
  //   try {
  //     try {
  //       const session = await ShoppingSessionModel.findById(SessionId);
  //       if (session) {
  //         return session;
  //       } else throw new Error("");
  //     } catch (e: any) {
  //       const newSession = new ShoppingSessionModel();
  //       await newSession.save();
  //       return newSession;
  //     }
  //   } catch (e: any) {
  //     throw new APIError("get Session By Id", e.message);
  //   }
  // }

  async setSettionCart(Id: string, Cart: any) {
    try {
      const userSession = await this.getUserSession(Id);
      const session = await ShoppingSessionModel.updateOne({ _id: userSession._id }, { $set: { Cart: Cart } });
      return session;
      // if (session) {
      //   // session.Cart = Cart;
      //   // await session.save();
      //   return session;
      // } else {
      //   throw new BadRequestError("Session not found");
      // }
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async getOrCreateFirstShopOrderStatus() {
    try {
      const orderstatusList = await OrderStatusModel.find({ Role: "Seller", Serial: 1 });
      let orderstatus;
      if (orderstatusList.length === 0) {
        orderstatus = new OrderStatusModel({ Serial: 1, Role: "Seller", Color: true, Name: "Order Received" });
        await orderstatus.save();
      } else {
        orderstatus = orderstatusList[0];
      }
      return orderstatus;
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }
  async createOrder(UserId: string, DeliverySchedule: string, Contacts: any, BillingAddress: any, ShippingAddress: any, OrderShops: any, Total: number, SessionId: string) {
    const orderstatusList = await OrderStatusModel.find({ Serial: 1, Role: "Admin" });
    let orderstatus;
    if (orderstatusList.length === 0) {
      orderstatus = new OrderStatusModel({ Serial: 1, Role: "Admin", Color: true, Name: "Order Received" });
      await orderstatus.save();
    } else {
      orderstatus = orderstatusList[0];
    }
    try {
      const order = new OrdersModel({
        UserId,
        Total,
        Status: orderstatus._id,
        DeliverySchedule,
        Contacts: Contacts.map((v: any) => ({ Title: v.Title, Value: v.Value })),
        BillingAddress: { City: BillingAddress.City, Country: BillingAddress.Country, State: BillingAddress.State, StreetAddress: BillingAddress.StreetAddress, Title: BillingAddress.Title, Zip: BillingAddress.Zip },
        ShippingAddress: { City: ShippingAddress.City, Country: ShippingAddress.Country, State: ShippingAddress.State, StreetAddress: ShippingAddress.StreetAddress, Title: ShippingAddress.Title, Zip: ShippingAddress.Zip },
        OrderShops,
        SessionId,
      });
      await order.save();
      return order;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createWish(UserId: string, ProductId: string) {
    try {
      const wish = new WishListModel({
        UserId,
        ProductId,
      });
      await wish.save();
      return wish;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async removeWish(UserId: string, ProductId: string) {
    try {
      const wish = await WishListModel.deleteOne({ UserId, ProductId });
      return { ...wish, UserId, ProductId };
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getAdminOrders(Page: number, Limit: number) {
    try {
      const orders = await OrdersModel.aggregate([
        {
          $lookup: {
            from: "OrderStatus",
            localField: "Status",
            foreignField: "_id",
            as: "Status",
          },
        },
        { $unwind: "$Status" },
      ]);
      return this.Pageination(orders, Page, Limit);
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }
  async getSellerOrders(Shops: any, Page: number, Limit: number) {
    try {
      const orders = await OrdersModel.find({ "OrderShops.ShopId": { $in: Shops } });
      return this.Pageination(orders, Page, Limit);
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }

  async getOrderStatusByIds(Ids: any[]) {
    try {
      const order = await OrderStatusModel.find({ _id: { $in: Ids } });
      return order;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getOrderbyId(Id: string) {
    try {
      const order = await OrdersModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(Id) } },
        {
          $lookup: {
            from: "OrderStatus",
            localField: "Status",
            foreignField: "_id",
            as: "Status",
          },
        },
        { $unwind: "$Status" },
      ]);
      if (order.length < 1) {
        throw new BadRequestError(`order with id ${Id} not found`);
      }
      return order[0];
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getSellerOrderbyId(Shops: any, Id: string) {
    try {
      const order = await OrdersModel.find({ _id: Id, "OrderShops.ShopId": { $in: Shops } });
      if (!order) {
        throw new BadRequestError(`order with id ${Id} not found`);
      }
      return order[0].toObject();
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createShipping(Name: string, Global: boolean, Amount: number, ShippingType: string, Country: string, State: string, ZIP: string) {
    try {
      const Shipping = new ShippingsModel({
        Amount,
        Global,
        Name,
        ShippingType,
      });

      const Local: any = {};
      if (!Global) {
        if (!Country || !State || !ZIP) {
          throw new BadRequestError("Country , State and ZIP is reqired for local shipping");
        }
        Local["Country"] = Country;
        Local["State"] = State;
        Local["ZIP"] = ZIP;
        Shipping.Local = Local;
      }
      await Shipping.save();
      return Shipping;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getShippings(Page: number, Limit: number) {
    try {
      const shippings = await ShippingsModel.find().lean();
      return this.Pageination(shippings, Page, Limit);
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }
  async getShippingById(Id: string) {
    try {
      const shipping = await ShippingsModel.findById(Id);
      if (!shipping) {
        throw new BadRequestError(`shipping with id ${Id} not found`);
      }
      return shipping;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async editShippings(id: string, Name: string, Global: boolean, Amount: number, ShippingType: string, Country: string, State: string, ZIP: string) {
    try {
      const shipping = await ShippingsModel.findById(id);
      if (!shipping) {
        throw new BadRequestError(`shipping with id ${id} not found`);
      }
      Name && (shipping.Name = Name);
      if (Global === false || Global === true) {
        shipping.Global = Global;
        if (Global === false) {
          if (shipping.Local) {
            Country && (shipping.Local.Country = Country);
            State && (shipping.Local.State = State);
            ZIP && (shipping.Local.ZIP = ZIP);
          } else {
            const Local: any = {};
            Country && (Local.Country = Country);
            State && (Local.State = State);
            ZIP && (Local.ZIP = ZIP);
            shipping.Local = Local;
          }
        } else {
          shipping.Local = undefined;
        }
      }
      ShippingType && (shipping.ShippingType = ShippingType);
      if (Amount !== undefined && Amount !== null) {
        shipping.Amount = Amount;
      }
      await shipping.save();
      return shipping;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getClientOrders(UserId: string, Page: number, Limit: number) {
    try {
      const orders = await OrdersModel.aggregate([
        {
          $lookup: {
            from: "OrderStatus",
            localField: "Status",
            foreignField: "_id",
            as: "Status",
          },
        },
        { $unwind: "$Status" },
        { $sort: { createdAt: -1 } },
      ]);
      //.sort({ createdAt: -1 });
      return this.Pageination(orders, Page, Limit);
    } catch (e: any) {
      throw new APIError("get Order error");
    }
  }

  async createOrderStatus(Name: string, Role: string, HasFail: boolean = false, FailName: string) {
    try {
      const tmp = await OrderStatusModel.find({ Role: Role, IsDeleted: false }).sort({ Serial: -1 }).limit(1);

      const Serial = (tmp[0]?.Serial || 0) + 1;
      let orderstatus;
      let orderstatus2;

      if (HasFail) {
        orderstatus = new OrderStatusModel({
          Name,
          Serial,
          Role,
          Type: "Success",
        });
        orderstatus2 = new OrderStatusModel({
          Name: FailName,
          Serial,
          Role,
          Type: "Fail",
        });
      } else {
        orderstatus = new OrderStatusModel({
          Name,
          Serial,
          Role,
          Type: "Success",
        });
      }

      await orderstatus.save();
      const res = [orderstatus];
      if (orderstatus2) {
        await orderstatus2.save();
        res.push(orderstatus2);
      }
      return res;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async deleteOrderStatus(Id: string) {
    try {
      const OrderStatus = await OrderStatusModel.findById(Id);
      if (!OrderStatus) {
        throw new BadRequestError(`status with id ${Id} not fount`);
      }
      OrderStatus.IsDeleted = true;
      await OrderStatus.save();
      return OrderStatus;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async editOrderStatus(Id: string, Name: string, Serial: number, Role: string, Type: string) {
    try {
      const orderstatus = await OrderStatusModel.findById(Id);
      if (!orderstatus) {
        throw new BadRequestError(`orderstatus with id ${Id} not found`);
      }
      Name && (orderstatus.Name = Name);
      Serial !== undefined && (orderstatus.Serial = Serial);
      Role && (orderstatus.Role = Role);
      Type && (orderstatus.Type = Type);

      await orderstatus.save();
      return orderstatus;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getOrderStatus(Page: number, Limit: number, Role: string) {
    // try {
    //   const orderstatus = await OrderStatusModel.find({ Role, IsDeleted: false }).sort({ Serial: 1, Type: -1 });
    //   return this.Pageination(orderstatus, Page, Limit);
    // } catch (e: any) {
    //   throw new APIError(e.message);
    // }
    try {
      return await this.Pageination2(
        async () => {
          const filter = { Role, IsDeleted: false };
          const count = await OrderStatusModel.countDocuments(filter);
          const query = OrderStatusModel.find(filter);
          return { count, query };
        },
        Page,
        Limit,
        (collection) => {
          return collection.sort({ Serial: 1, Type: -1 });
        }
      );
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }

  async getAllOrderStatus(Role: string) {
    try {
      const orderstatus = await OrderStatusModel.find({ Role, IsDeleted: false }).sort({ Serial: 1, Type: -1 });
      return orderstatus;
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }
  async getOrderStatusById(Id: string) {
    try {
      const orderstatus = await OrderStatusModel.findById(Id);
      if (!orderstatus) {
        throw new BadRequestError("order status with id ${Id} not found");
      }
      return orderstatus;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateOrderShopsStatus(OrderId: string, ShopId: string, StatusId: string) {
    try {
      const [order, OrderStatus] = await Promise.all([OrdersModel.findById(OrderId), OrderStatusModel.find({ _id: StatusId, Role: "Seller" })]);
      if (!order) {
        throw new BadRequestError(`order with id ${OrderId} not found`);
      }
      if (OrderStatus.length === 0) {
        throw new BadRequestError(`status with id ${StatusId} not found`);
      }
      const shop = order.OrderShops.find((v) => "" + v.ShopId === ShopId);
      if (!shop) {
        throw new BadRequestError(`OrderShop with id ${ShopId} for order ${OrderId} not found`);
      }
      shop.ShopOrderStatus = new mongoose.Types.ObjectId(StatusId);
      await order.save();
      return order;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateOrderStatus(Id: string, StatusId: string) {
    try {
      const [order, status] = await Promise.all([OrdersModel.findById(Id), OrderStatusModel.findById(StatusId)]);
      if (!order) {
        throw new BadRequestError(`order with id ${Id} not found`);
      }
      if (!status) {
        throw new BadRequestError(`status whith id ${StatusId} not found`);
      }
      order.Status = status._id;
      await order.save();
      return order;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateOrderDeliveryState(Id: string, ShopId: string, State: string, Message: string) {
    try {
      const order = await OrdersModel.find({ _id: Id, "OrderShops.ShopId": ShopId });

      if (order.length > 0) {
        for (const shop of order[0].OrderShops) {
          if ("" + shop.ShopId === ShopId) {
            State && (shop.AdminDeliveryStatus = State);
            Message && (shop.Message = Message);
            Message && (shop.MessageLog = (shop.MessageLog || "") + (shop.MessageLog ? "\n" : "") + `-${new Date().toUTCString()}-: ${shop.AdminDeliveryStatus} => ${Message}`);
          }
        }
        await order[0].save();
        return order[0].toObject();
      } else {
        throw new BadRequestError(`order with id ${Id} and orderShopId ${ShopId} not found`);
      }
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  // private ReversePageination(Data: any[], Page: number = 1, Limit: number = 12) {
  //   Page = Page < 1 ? 0 : Page - 1;
  //   const count = Data.length;
  //   let result;
  //   if (Page * Limit + Limit <= count) {
  //     result = Data.slice(count - (Page * Limit + Limit), count - Page * Limit);
  //   } else {
  //     result = Data.slice(0,count-Math.trunc(count / Limit) * Limit);
  //   }
  //   let CurPage = Page * Limit + Limit < count ? Page + 1 : Math.ceil(count / Limit);
  //   CurPage = CurPage === 0 ? 1 : CurPage;
  //   const HasNext = Page * Limit + Limit < count;
  //   return { Data: result, Page: CurPage, HasNext,Count:count };
  // }
  private async Pageination2(cb1: () => Promise<{ count: number; query: mongoose.Query<any[], any, {}, any> | mongoose.Aggregate<any[]> }>, Page: number = 1, Limit: number = 12, cb2: (d: mongoose.Query<any[], any, {}, any> | mongoose.Aggregate<any[]>) => any) {
    Page = Page < 1 ? 0 : Page - 1;
    const { count, query } = await cb1();
    let result;
    if (Page * Limit + Limit <= count) {
      const data = query.skip(Page * Limit).limit(Limit);
      result = await cb2(data);
    } else {
      const data = query.skip(Math.trunc(count / Limit) * Limit);
      result = await cb2(data);
    }
    let CurPage = Page * Limit + Limit < count ? Page + 1 : Math.ceil(count / Limit);
    CurPage = CurPage === 0 ? 1 : CurPage;
    const HasNext = Page * Limit + Limit < count;
    return { Data: result, Page: CurPage, HasNext, Count: count, Pages: Math.ceil(count / Limit) };
  }

  private Pageination(Data: any[], Page: number = 1, Limit: number = 12) {
    Page = Page < 1 ? 0 : Page - 1;
    const count = Data.length;
    let result;
    if (Page * Limit + Limit <= count) {
      result = Data.slice(Page * Limit, Page * Limit + Limit);
    } else {
      result = Data.slice(Math.trunc(count / Limit) * Limit, count);
    }
    let CurPage = Page * Limit + Limit < count ? Page + 1 : Math.ceil(count / Limit);
    CurPage = CurPage === 0 ? 1 : CurPage;
    const HasNext = Page * Limit + Limit < count;
    return { Data: result, Page: CurPage, HasNext, Count: count, Pages: Math.ceil(count / Limit) };
  }
}
