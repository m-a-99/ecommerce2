import mongoose from "mongoose";
import { APIError, BadRequestError } from "../../utils/app-errors";
import { OrdersModel, ShippingsModel, ShoppingSessionModel, WishListModel } from "../models";

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
  async createOrder(UserId: string, DeliverySchedule: string, OrderItems: any, Amount: number, SessionId: string) {
    try {
      const order = new OrdersModel({
        UserId,
        Amount,
        DeliverySchedule,
        OrderItems,
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
      const orders = await OrdersModel.find();
      return this.Pageination(orders, Page, Limit);
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }

  async getShopsOrders(UserId: string) {
    try {
    } catch (e: any) {}
  }

  async getOrderbyId(Id:string){
    try{
      const order =await OrdersModel.findById(Id).lean()
      if(!order){
        throw new BadRequestError(`order with id ${Id} not found`);
      }
      return order
    }catch(e:any){
      throw new BadRequestError(e.message)
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
      const orders = await OrdersModel.find({ UserId: new mongoose.Types.ObjectId(UserId) }).sort({ createdAt:-1});
      return this.Pageination(orders, Page, Limit);
    } catch (e: any) {
      throw new APIError("get Order error");
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
