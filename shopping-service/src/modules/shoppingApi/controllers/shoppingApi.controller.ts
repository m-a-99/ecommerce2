import { shoppingApiService } from "../services/shoppingApi.service";
import express from "express";
import { authMiddleWare } from "./middlewares/auth.middlewares";

export class shoppingApiController {
  private auth: authMiddleWare;
  constructor(private app: express.Application, private service: shoppingApiService) {
    this.auth = new authMiddleWare(service);
    this.init();
  }
  init() {
    this.app.get("/test", (req, res) => {
      res.status(200).send("success");
    });
    // this.app.post("/session/create", async (req: any, res: any, next) => {
    //   try {
    //     const { SessionId } = req.body || {};
    //     const session = await this.service.CreateSession(SessionId);
    //     res.status(200).json(session);
    //   } catch (e) {
    //     next(e);
    //   }
    // });

    this.app.post("/session", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next) => {
      try {
        // const { SessionId } = req.body || {};
        const user = req.user;
        const Session = await this.service.GetSession(user);
        res.status(200).json(Session);
      } catch (e) {
        next(e);
      }
    });

    this.app.post("/session/setcart", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next) => {
      try {
        const { Cart } = req.body || {};
        const session = await this.service.setSessionCart(req.user._id, Cart);
        res.status(200).json(session);
      } catch (e) {
        next(e);
      }
    });

    this.app.post("/wish", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next) => {
      try {
        console.log(req.body);
        const { ProductId } = req.body;
        console.log(ProductId);
        const wish = await this.service.createWish(req?.user?._id, ProductId);
        res.status(200).json(wish);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.delete("/wish", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next) => {
      try {
        const { ProductId } = req.body;
        const wish = await this.service.removeWish(req.user._id, ProductId);
        res.status(200).json(wish);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.post("/orders", this.auth.checkAuth.bind(this.auth), async (req: any, res, next) => {
      try {
        const { DeliverySchedule, Contacts, BillingAddress, ShippingAddress } = req.body || {};
        const order = await this.service.createOrder(req.user, DeliverySchedule, Contacts, BillingAddress, ShippingAddress);
        res.status(200).json(order);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/shippings", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const page = Number.parseInt((req?.query?.page as string) || "1");
        const shippings = await this.service.getShippings(page);
        res.status(200).json(shippings);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.get("/shippings/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { id } = req.params || {};
        const shippings = await this.service.getShippingById(id);
        res.status(200).json(shippings);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/shippings", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Name, Global, Amount, ShippingType, Country, State, ZIP } = req.body || {};
        const shipping = await this.service.createShipping(Name, Global, Amount, ShippingType, Country, State, ZIP);
        res.status(200).json(shipping);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/orders/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { id } = req.params || {};
        let order: any;
        switch (req?.user?.AccountType) {
          case "Admin":
            order = await this.service.getAdminOrderbyId(id);
            break;
          case "Seller":
            order = await this.service.getSellerOrderbyId(req.user, id);
            break;
        }
        res.status(200).json(order);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/orders", this.auth.checkAuth.bind(this.auth), async (req: any, res, next) => {
      try {
        let orders: any;
        const page = req?.query?.page || 1;
        switch (req?.user?.AccountType) {
          case "Client":
            orders = await this.service.getClientOrders(req.user, page);
            break;
          case "Admin":
            orders = await this.service.getAdminOrders(page);
            break;
          case "Seller":
            orders = await this.service.getSellerOrders(req.user, page);
            break;
        }
        res.status(200).send(orders);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/shippings/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { id } = req.params;
        const { Name, Global, Amount, ShippingType, Country, State, ZIP } = req.body || {};
        const shipping = await this.service.editShippings(id, Name, Global, Amount, ShippingType, Country, State, ZIP);
        res.status(200).json(shipping);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/orders/status/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { id } = req.params || {};
        const { StatusId } = req.body || {};
        const order = await this.service.updateOrderStatus(id, StatusId);
        res.status(200).json(order);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/orders/ordershops/status/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req, res, next) => {
      try {
        const OrderId = req?.params?.id || "";
        const { ShopId, StatusId } = req.body || {};
        const order = await this.service.updateOrderShopStatus(OrderId, ShopId, StatusId);
        res.status(200).json(order);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/orders/deliverystate/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { id } = req.params || {};
        const { ShopId, State, Message } = req.body || {};
        const order = await this.service.updateOrderDeliveryState(id, ShopId, State, Message);
        res.status(200).json(order);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.post("/orderstatus", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Name, Role, HasFail, FailName } = req.body || {};
        const orderstatus = await this.service.createOrderStatus(Name, Role, HasFail, FailName);
        res.status(200).json(orderstatus);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/orderstatus", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const page = req.query?.page || "1";
        const role = req.query?.role || "Admin";
        const orderstatus = await this.service.getOrderStatus(Number.parseInt("" + page), "" + role);
        res.status(200).json(orderstatus);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/orderstatus/all", this.auth.checkAuth.bind(this.auth), async (req: any, res, next) => {
      try {
        const role = req.user.AccountType;
        let orderstatus;
        switch (role) {
          case "Seller":
            orderstatus = await this.service.getAllOrderStatus("Seller");
            break;
          case "Admin":
            orderstatus = await this.service.getAllOrderStatus("Admin");
          case "Client":
            orderstatus = await this.service.getAllOrderStatus("Admin");
        }
        res.status(200).json(orderstatus);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/orderstatus/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { id } = req.params || {};
        const orderstatus = await this.service.getOrderStatusById(id);
        res.status(200).json(orderstatus);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.delete("/orderstatus/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { id } = req?.params || {};
        const orderstatus = await this.service.deleteOrderStatus("" + id);
        res.status(200).json(orderstatus);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/orderstatus/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const id = req.params?.id || "";
        const { Name, Serial, Role, Type } = req.body || {};
        const orderstatus = await this.service.editOrderStatus(id, Name, Serial, Role, Type);
        res.status(200).json(orderstatus);
      } catch (e: any) {
        next(e);
      }
    });
  }
}
