import express from "express";
import { AdminApiService } from "../services/AdminApi.service";
import { authMiddleWare } from "./middlewares/auth.middleware";
export class AdminApiConroller {
  private auth: authMiddleWare;
  constructor(private app: express.Application, private service: AdminApiService) {
    this.auth = new authMiddleWare(service);
    this.init();
  }

  init() {
    this.app.get("/test", (req, res) => {
      res.status(200).send("success");
    });

    this.app.get("/groups", async (req, res, next) => {
      try {
        const groups = await this.service.getGroups();
        res.status(200).json(groups);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/groups/createuploadurl", async (req, res, next) => {
      try {
        const { PromotionalSliders, Banners }: { PromotionalSliders?: string; Banners?: string } = req.query || {};
        const resData = await this.service.createGroupUploadUrl(PromotionalSliders, Banners);
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/groups/creategroup", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Name, Icon, Layout, ProductCard, PromotionalSliders, Banners, IsMainGroup } = req.body || {};
        console.log(IsMainGroup);
        const group = await this.service.createGroup(Name, Icon, Layout, ProductCard, PromotionalSliders, Banners, IsMainGroup);
        res.status(200).json(group);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/categories", async (req, res, next) => {
      try {
        const categories = await this.service.getCategories();
        res.status(200).json(categories);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/categories/:id", async (req, res, next) => {
      try {
        const id = req?.params?.id || "";
        const category = await this.service.getCategoryById(id);
        res.status(200).json(category);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/categories/createcategory", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Name, Details, Icon, Group, IsChildCategory, ParentCategory } = req.body || {};
        const category = await this.service.createCategory(Name, Details, Icon, Group, IsChildCategory, ParentCategory);
        res.status(200).json(category);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.put("/categories/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const id = req?.params?.id || "";
        const { Name, Details, Icon, Group, SubCategories, DeletedSubCategoriesIds } = req.body || {};
        const category = await this.service.updateCategoryById(id, Name, Details, Icon, Group, SubCategories, DeletedSubCategoriesIds);
        res.status(200).json(category);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/icons", async (req, res, next) => {
      try {
        const icons = await this.service.getIcons();
        res.status(200).json(icons);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/icons/createuploadurl", async (req, res, next) => {
      try {
        const resDate = await this.service.createIconUploadUrl();
        res.status(200).json(resDate);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/icons/:id", async (req, res, next) => {
      try {
        const id = req?.params?.id || "";
        const icons = await this.service.getIconById(id);
        res.status(200).json(icons);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/Icons/createicon", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Name, Icon } = req.body || {};
        const icon = await this.service.createIcon(Name, Icon);
        res.status(200).json(icon);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/icons/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const id = req?.params?.id || "";
        const { Name, Icon } = req.body || {};
        const icon = await this.service.updateIconById(id, Name, Icon);
        res.status(200).json(icon);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/tags", async (req, res, next) => {
      try {
        const tags = await this.service.getTags();
        res.status(200).json(tags);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/tags/:id", async (req, res, next) => {
      try {
        const id = req.params.id || "";
        const tags = await this.service.getTagById(id);
        res.status(200).json(tags);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/tags/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const id = req.params.id || "";
        const { Name, Details, Icon, Group } = req.body || {};
        const tag = await this.service.updateTagById(id, Name, Details, Icon, Group);
        res.status(200).json(tag);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/tags/createtag", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Name, Details, Icon, Group } = req.body || {};
        const tag = await this.service.createTag(Name, Details, Icon, Group);
        res.status(200).json(tag);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/socialmediaplatforms", async (req, res, next) => {
      try {
        const socialmediaplatforms = await this.service.getSocialMediaPlatforms();
        res.status(200).json(socialmediaplatforms);
      } catch (e: any) {
        next(e);
      }
    });
 

    this.app.get("/socialmediaplatforms/createuploadurl", async (req, res, next) => {
      try {
        const resData = await this.service.createSocialMediaPlatformUploadUrl();
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });
       this.app.get("/socialmediaplatforms/:id", async (req, res, next) => {
         try {
           const id = req?.params?.id || "";
           const socialmediaplatforms = await this.service.getSocialMediaPlatformById(id);
           res.status(200).json(socialmediaplatforms);
         } catch (e: any) {
           next(e);
         }
       });

    this.app.post("/socialmediaplatforms/createsocialmediaplatform", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const { Icon, Name } = req.body || {};
        const socialmediaplatform = await this.service.createSocialMediaPlatform(Icon, Name);
        res.status(200).json(socialmediaplatform);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/socialmediaplatforms/:id", this.auth.checkAuth.bind(this.auth), this.auth.checkAdmin.bind(this.auth), async (req, res, next) => {
      try {
        const id = req?.params?.id || "";
        const { Name, Icon } = req.body || {};
        const socialmediaplatform = await this.service.updateSocialMediaPlatform(id, Name, Icon);
        res.status(200).json(socialmediaplatform);
      } catch (e: any) {
        next(e);
      }
    });
  }
}
