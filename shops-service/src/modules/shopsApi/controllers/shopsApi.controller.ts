import express from "express";
import { shopsApiService } from "../services/shopsApi.service";
import { authMiddleWare } from "./middlewares/auth.middlewares";
import { UnauthorizedError } from "../../../utils/app-errors";
export class shopsApiConroller {
  private auth: authMiddleWare;
  constructor(private app: express.Application, private service: shopsApiService) {
    this.auth = new authMiddleWare(service);
    this.init();
  }
  init() {
    this.app.get("/test", (req, res) => {
      res.status(200).send("success");
    });

    this.app.get("/shops",this.auth.checkAuth.bind(this.auth),this.auth.checkAdmin.bind(this.auth), async (req: any, res, next) => {
      try {
        const shops = await this.service.getShops();
        res.status(200).json(shops);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/sellershops", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const shops = await this.service.getSelllerShops(req.user._id);
        res.status(200).json(shops);
      } catch (e: any) {
        next(e);
      }
    });

    
    this.app.get("/shops/createuploadurl", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const uploadurl = await this.service.createShopsUploadUrl();
        console.log(uploadurl);
        res.status(200).json(uploadurl);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/shops/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const ShopId = req.params.id || "";
        const { Logo, CoverImage, Name, Description, Active, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude } = req.body || {};
        const shop = await this.service.updateShopById(req.user, ShopId, Logo, CoverImage, Name, Description, Active, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude);
        res.status(200).json(shop);
      } catch (e: any) {
        next(e);
      }
    });
    
    this.app.get("/shops/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const Id = req.params.id;
        const shop = await this.service.getShopById(Id);
        res.status(200).json(shop || {});
      } catch (e: any) {
        next(e);
      }
    });
    
    this.app.post("/shops/createshop", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { Logo, CoverImage, Name, Description, Active, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude } = req.body || {};
        const shop = await this.service.createShop(req.user._id, Logo, CoverImage, Name, Description, Active, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude);
        res.status(200).json(shop);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/attributes", async (req, res, next) => {
      try {
        const attributes = await this.service.getAttributes();
        res.status(200).json(attributes);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/attributes/:id",async (req,res,next)=>{
      try{
        const {id}=req.params||{};
        const attribute = await this.service.getAttributeById(id);
        res.status(200).json(attribute);

      }catch(e: any){
        next(e)
      }
    })
    this.app.post("/attributes/createattribute", this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { ShopId, Name, AttributeValues } = req.body || {};
        const attribute = await this.service.createAttribute(ShopId, Name, AttributeValues);
        res.status(200).json(attribute);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/attributes/:attributeId", this.auth.checkAuth.bind(this.auth), this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { ShopId, Name, AttributeValues, DeletedAttributeValuesIds } = req.body || {};
        const { attributeId } = req.params || {};
        const attribute = await this.service.editAttribute(req.user,attributeId, ShopId, Name, AttributeValues, DeletedAttributeValuesIds);
        res.status(200).json(attribute);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.get("/manufacturers", async (req, res, next) => {
      try {
        const manufacturers = await this.service.getManufacturers();
        res.status(200).json(manufacturers);
      } catch (e: any) {
        next(e);
      }
    });
   
    this.app.put("/manufacturers/:id",this.auth.checkAuth.bind(this.auth),this.auth.checkAdminOrSeller.bind(this.auth),async(req:any,res,next)=>{
      try{
        const id=req?.params?.id||""
        const { Logo, CoverImage, ShopId, Name, Website, Description, Group, SocialProfiles, DeletedSocialProfilesIds } = req.body || {};
        const manufacturer=await this.service.updateManufacturer(req.user,id, Logo, CoverImage, ShopId, Name, Website, Description, Group, SocialProfiles, DeletedSocialProfilesIds)
        res.status(200).json(manufacturer);
      }catch(e:any){
        next(e)
      }
    });
    this.app.get("/manufacturers/createuploadurl", this.auth.checkAuth.bind(this.auth), this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const resData = await this.service.createManufacturersUploadUrl();
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });
    
    this.app.put('/authors/:id',this.auth.checkAuth.bind(this.auth),this.auth.checkAdminOrSeller.bind(this.auth),async (req:any,res,next)=>{
        try{
            const id=req?.params?.id||"";
            const { Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles, DeletedSocialProfilesIds } = req.body;
            const author=await this.service.updateAuthor(req.user, id, Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles, DeletedSocialProfilesIds)
            res.status(200).json(author);
        }catch(e:any){
          next(e)
        }
    })
     this.app.get("/manufacturers/:id", async (req, res, next) => {
       try {
         const id = req?.params?.id || "";
         const manufacturers = await this.service.getManufacturerById(id);
         res.status(200).json(manufacturers);
       } catch (e: any) {
         next(e);
       }
     });


    this.app.post("/manufacturers/createmanufacturer",this.auth.checkAuth.bind(this.auth), this.auth.checkSeller.bind(this.auth),async (req: any, res, next) => {
      try {
        const { Logo, CoverImage,ShopId, Name, Website, Description, Group, SocialProfiles } = req.body || {};
        const manufacturer = await this.service.createManufacturer(req.user,Logo, CoverImage, ShopId, Name, Website, Description, Group, SocialProfiles);
        res.status(200).send(manufacturer);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/authors", async (req, res, next) => {
      try {
        const authors = await this.service.getAuthors();
        res.status(200).json(authors);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/authors/createuploadurl", async (req: any, res, next) => {
      try {

        const resData = await this.service.createAuthorsUploadUrl();
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });



    this.app.get("/authors/:id", async (req, res, next) => {
      try {
        const id =req?.params?.id||"";
        const author = await this.service.getAuthorById(id);
        res.status(200).json(author);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/authors/createauthor",this.auth.checkAuth.bind(this.auth),this.auth.checkAdminOrSeller.bind(this.auth), async (req: any, res, next) => {
      try {
        const { Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles } = req.body || {};
        const author = await this.service.createAuthor(Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles);
        res.status(200).json(author);
      } catch (e: any) {
        next(e);
      }
    });
  }
}
