import { ShoppingRepository } from "../../../database";
import { productsService } from "../../../services/products.service";
import { shopsService } from "../../../services/shops.service";
import { usersService } from "../../../services/users.service";
import { BadRequestError, UnauthorizedError } from "../../../utils/app-errors";
import { shoppingApiRemoteService } from "./shoppingApi.remote.service";

export class shoppingApiService {
  constructor(private repository: ShoppingRepository, private remoteService: shoppingApiRemoteService, private users_service: usersService, private products_service: productsService,private shops_service:shopsService) {}
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

  async createOrder(User: any, DeliverySchedule: string) {
    if (!User) {
      throw new UnauthorizedError("login required to order");
    }
    const session = await this.GetSession(User);
    await this.repository.closeSession(session.session._id);
    if (session.session.Cart.length === 0) {
      throw new BadRequestError("empty Cart");
    }
    let products = await this.products_service.getCartProductsByIds(session.session.Cart);
    const OrderItems: any = [];
    session.session.Cart.forEach((Cartitem: any) => {
      // const cartItem = session.session.Cart.filter((v: any) => (v.ProductId = Product._id))[0];
      const Product = { ...products[Cartitem.ProductId] };
      if (Product.ProductType !== "Simple") {
        Product.VariableProduct = Product.VariableProduct.filter((v: any) => "" + v._id === "" + Cartitem.VariableId);
      }
      OrderItems.push({ Product, Quantity: Cartitem.Quantity });
    });
    const Amount = OrderItems.reduce((pre: any, cur: any) => {
      return pre + (cur.Product.ProductType === "Simple" ? cur.Product.SimpleProduct.Price : cur.Product.VariableProduct[0].Price);
    }, 0);
    // console.log(OrderItems);
    const order = await this.repository.createOrder(User._id, DeliverySchedule, OrderItems, Amount, session.session._id);
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
    return await this.repository.getAdminOrders(Page,4);
  }

  async getOrderbyId(Id:string){
    const order= await this.repository.getOrderbyId(Id);
    const shops:any = await this.shops_service.getShopsByIds(order.OrderItems.map(v=>""+v.Product?.ShopId||"").filter(v=>v!==""))||{}
    order.OrderItems=order.OrderItems.map(v=>({
      ...v,Product:{...v.Product,Shop:shops[""+v.Product?.ShopId]}
    })) as any
    return order
    // order.fore
  }

  async getClientOrders(user: any,Page:number) {
    return await this.repository.getClientOrders(user._id, Page,4);
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

  
}
