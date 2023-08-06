import { ShoppingRepository } from "../../../database";
import { productsService } from "../../../services/products.service";
import { shopsService } from "../../../services/shops.service";
import { usersService } from "../../../services/users.service";
import { ArrToObj } from "../../../utils";
import { BadRequestError, UnauthorizedError } from "../../../utils/app-errors";
import { shoppingApiRemoteService } from "./shoppingApi.remote.service";

export class shoppingApiService {
  constructor(private repository: ShoppingRepository, private remoteService: shoppingApiRemoteService, private users_service: usersService, private products_service: productsService, private shops_service: shopsService) {}
  // async CreateSession(SessionId: string) {
  //   const session = await this.repository.createSession(SessionId);
  //   return { SessionId: session?._id };
  // }

  private async SessionJoin(Session: any) {
    const Ids = (Session?.Cart || []).map((v: any) => v.ProductId);
    const resData = await this.products_service.getProductByIds(Ids);
    const session = Session.toObject();
    const Cart = (Session?.Cart || []).map((v: any) => {
      const tmp = v.toObject();
      const VariableProduct = resData[tmp.ProductId].VariableProduct.filter((vr: any) => vr._id === "" + tmp.VariableId);
      tmp.Product = { ...resData[tmp.ProductId], VariableProduct };
      return tmp;
    });
    session.Cart = Cart;
    return session;
  }
  /*************************************************************************** */
  /*************************************************************************** */
  /*************************************************************************** */

  async GetSession(user: any) {
    if (!user) {
      return { login: false };
    } else {
      const Session = await this.repository.getUserSession(user._id);
      const resData = await this.SessionJoin(Session);
      return { login: true, session: resData };
    }
  }

  async setSessionCart(userId: string, Cart: any) {
    await this.products_service.ProductsValidation(Cart);
    const session = await this.repository.setSettionCart(userId, Cart);
    return session;
  }

  async createOrder(User: any, DeliverySchedule: string, Contacts: { Type: string; Value: string }[], BillingAddress: any, ShippingAddress: any) {
    // if (!User) {
    //   throw new UnauthorizedError("login required to order");
    // }
    const session = await this.GetSession(User);
    if (session.session.Cart.length === 0) {
      throw new BadRequestError("empty Cart");
    }
    const ShopOrderStatus = await this.repository.getOrCreateFirstShopOrderStatus();
    let products = await this.products_service.getCartProductsByIds(session.session.Cart);
    const OrderShops: any = {};
    session.session.Cart.forEach((Cartitem: any) => {
      // const cartItem = session.session.Cart.filter((v: any) => (v.ProductId = Product._id))[0];
      const Product = { ...products[Cartitem.ProductId] };
      if (Product.ProductType !== "Simple") {
        Product.VariableProduct = Product.VariableProduct.filter((v: any) => "" + v._id === "" + Cartitem.VariableId);
      }
      if (OrderShops[Product.ShopId]?.OrderItems) {
        OrderShops[Product.ShopId].OrderItems.push({ Product, Quantity: Cartitem.Quantity });
      } else {
        OrderShops[Product.ShopId] = { OrderItems: [{ Product, Quantity: Cartitem.Quantity }], ShopId: Product.ShopId, ShopOrderStatus: ShopOrderStatus._id };
      }
    });

    let Total = 0;
    for (const key in OrderShops) {
      let amount = OrderShops[key].OrderItems.reduce((pre: number, cur: any) => {
        return pre + (cur.Product.ProductType === "Simple" ? cur.Product.SimpleProduct.Price : cur.Product.VariableProduct[0].Price);
      }, 0);
      OrderShops[key].Amount = amount;
      Total += amount;
    }
    const OrderShopsArr = Object.values(OrderShops);
    // const Total: number = OrderShopsArr.reduce((pre: number, cur: any) => {
    //   return pre + cur.Amount;
    // }, 0) as number;
    // const Amount = OrderٍShops.reduce((pre: any, cur: any) => {
    //   return pre + (cur.Product.ProductType === "Simple" ? cur.Product.SimpleProduct.Price : cur.Product.VariableProduct[0].Price);
    // }, 0);
    // console.log(OrderItems);
    const order = await this.repository.createOrder(User._id, DeliverySchedule, Contacts, BillingAddress, ShippingAddress, OrderShopsArr, Total, session.session._id);
    await this.repository.closeSession(session.session._id);
    return order;
  }

  async checkAuth(token: string) {
    return await this.users_service.checkAuth(token);
  }

  async createWish(userId: string, productId: string) {
    if (!userId) {
      throw new UnauthorizedError("Login required");
    }
    await this.products_service.productsByIdValidation([productId]);
    const wish = await this.repository.createWish(userId, productId);
    this.remoteService.prodcastWishList_create(wish);
    return wish;
  }
  async removeWish(userId: string, productId: string) {
    if (!userId) {
      throw new UnauthorizedError("Login required");
    }
    const wish = await this.repository.removeWish(userId, productId);
    this.remoteService.prodcastWishList_delete(wish);
    return wish;
  }

  async getAdminOrders(Page: number) {
    return await this.repository.getAdminOrders(Page, 4);
  }
  async getSellerOrders(User: any, Page: number) {
    const Shops: any = await this.shops_service.getShopsbyOwners([User._id]);

    return await this.repository.getSellerOrders(
      Object.values(Shops).map((shop: any) => shop._id),
      Page,
      4
    );
  }
  async getAdminOrderbyId(Id: string) {
    const order = await this.repository.getOrderbyId(Id);
    const Ids = order.OrderShops.map((v: any) => "" + v.ShopOrderStatus);
    const OrderStatusList = await this.repository.getOrderStatusByIds(Ids);
    const OrderStatusObj = ArrToObj(OrderStatusList, "_id");
    const shops: any = (await this.shops_service.getShopsByIds(order.OrderShops.map((v: any) => "" + v.ShopId))) || {};
    order.OrderShops = order.OrderShops.map((v: any) => ({
      ...v,
      ShopOrderStatus: OrderStatusObj["" + v.ShopOrderStatus],
      Shop: shops["" + v.ShopId],
    })) as any;
    console.log(Ids, OrderStatusList, OrderStatusObj, order);
    return order;
    // order.fore
  }

  async getSellerOrderbyId(User: any, Id: string) {
    const Shops: any = await this.shops_service.getShopsbyOwners([User._id]);
    const shopsids = Object.values(Shops).map((shop: any) => shop._id);

    const order = await this.repository.getSellerOrderbyId(shopsids, Id);

    const Ids = order.OrderShops.map((v) => "" + v.ShopOrderStatus);
    const OrderStatusList = await this.repository.getOrderStatusByIds(Ids);
    const OrderStatusObj = ArrToObj(OrderStatusList, "_id");

    order.OrderShops = order.OrderShops.filter((v: any) => shopsids.includes("" + v.ShopId));
    order.OrderShops = order.OrderShops.map((v: any) => ({
      ...v,
      Shop: Shops["" + v.ShopId],
      ShopOrderStatus: OrderStatusObj["" + v.ShopOrderStatus],
    })) as any;

    return { _id: order._id, OrderShops: order.OrderShops, createdAt: order.createdAt, updatedAt: order.updatedAt };
    // order.fore
  }
  async getClientOrders(user: any, Page: number) {
    return await this.repository.getClientOrders(user._id, Page, 4);
  }

  async getShippings(Page: number) {
    return await this.repository.getShippings(Page, 6);
  }

  async getShippingById(Id: string) {
    return await this.repository.getShippingById(Id);
  }

  async editShippings(id: string, Name: string, Global: boolean, Amount: number, ShippingType: string, Country: string, State: string, ZIP: string) {
    return await this.repository.editShippings(id, Name, Global, Amount, ShippingType, Country, State, ZIP);
  }

  async createShipping(Name: string, Global: boolean, Amount: number, ShippingType: string, Country: string, State: string, ZIP: string) {
    return await this.repository.createShipping(Name, Global, Amount, ShippingType, Country, State, ZIP);
  }

  async createOrderStatus(Name: string, Role: string, HasFail: boolean, FailName: string) {
    return await this.repository.createOrderStatus(Name, Role, HasFail, FailName);
  }

  async deleteOrderStatus(Id:string){
    return await this.repository.deleteOrderStatus(Id);
  }

  async getOrderStatus(Page: number, Role: string) {
    return await this.repository.getOrderStatus(Page,5, Role);
  }
  async getAllOrderStatus(Role: string) {
    return await this.repository.getAllOrderStatus(Role);
  }
  async getOrderStatusById(Id: string) {
    return await this.repository.getOrderStatusById(Id);
  }

  async editOrderStatus(Id: string, Name: string, Serial: number, Role: string, Type: string) {
    return await this.repository.editOrderStatus(Id, Name, Serial, Role, Type);
  }
  async updateOrderStatus(Id: string, StatusId: string) {
    return await this.repository.updateOrderStatus(Id, StatusId);
  }

  async updateOrderShopStatus(OrderId: string, ShopId: string, StatusId: string) {
    return await this.repository.updateOrderShopsStatus(OrderId, ShopId, StatusId);
  }

  async updateOrderDeliveryState(Id: string, ShopId: string, State: string, Message: string) {
    const order = await this.repository.updateOrderDeliveryState(Id, ShopId, State, Message);
    const shops: any = (await this.shops_service.getShopsByIds(order.OrderShops.map((v) => "" + v.ShopId))) || {};
    order.OrderShops = order.OrderShops.map((v) => ({
      ...v,
      Shop: shops["" + v.ShopId],
    })) as any;
    return order;
  }
}
