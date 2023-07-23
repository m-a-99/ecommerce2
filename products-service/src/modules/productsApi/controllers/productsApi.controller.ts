import express from "express";
import { productsApiService } from "../services/productsApi.service";
import { authMiddleWare } from "./middlewares/auth.middleware";
export class productApiController {
  private auth: authMiddleWare;
  constructor(private app: express.Application, private service: productsApiService) {
    this.auth = new authMiddleWare(service);
    this.init();
  }
  init() {
    this.app.get("/test", (req, res) => {
      res.status(200).send("success");
    });
    this.app.get("/products", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const Page = req?.query?.page;
        const products = await this.service.getproducts(req?.user?._id, Page);
        res.status(200).json(products);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/sellerproducts", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const products = await this.service.getSellerProducts(req?.user?._id || "");
        res.status(200).json(products);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/adminproducts", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req: any, res, next) => {
      try {
        const products = await this.service.getAdminProducts();
        res.status(200).json(products);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/products/createproduct", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { FeaturedImage, Gallery, ShopId, Group, Categories, Authors, Manufacturers, Tags, Name, Description, Unit, Status, ProductType, SimpleProduct, VariableProduct } = req.body || {};
        const product = await this.service.createProduct(FeaturedImage, Gallery, req.user._id, ShopId, Group, Categories, Authors, Manufacturers, Tags, Name, Description, Unit, Status, ProductType, SimpleProduct, VariableProduct);
        res.status(200).json(product);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/products/:productId", this.auth.checkAuth.bind(this.auth), this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const {State, Message, FeaturedImage, Gallery, ShopId, Group, Categories, Authors, Manufacturers, Tags, Name, Description, Unit, Status, ProductType, SimpleProduct, VariableProduct,  } = req.body || {};
        const { productId } = req.params || {};
        const product = await this.service.editProduct(productId, State, Message, FeaturedImage, Gallery, req.user, ShopId, Group, Categories, Authors, Manufacturers, Tags, Name, Description, Unit, Status, ProductType, SimpleProduct, VariableProduct);
        console.log(product);
        res.status(200).json(product);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/products/createuploadurl", async (req, res, next) => {
      try {
        const { Varients }: { Varients?: string } = req.query || {};
        const resData = await this.service.createProductUploadUrl(Number.parseFloat(Varients || "0"));
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.get("/products/:productId", async (req, res, next) => {
      try {
        const { productId } = req.params || {};
        const product = await this.service.getproductById(productId);
        res.status(200).json(product[0]);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/sellerproducts/:productId", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { productId } = req.params || {};
        const product = await this.service.getSellerProductById(req.user._id, productId);
        res.status(200).json(product[0]);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/wishlist", this.auth.checkAuth.bind(this.auth), async (req: any, res, next: any) => {
      try {
        const wishlist = await this.service.getWishList(req?.user?._id);
        res.status(200).json(wishlist);
      } catch (e: any) {
        next(e);
      }
    });
  }
}
