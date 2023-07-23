import express from "express";
import { userApiService } from "../services/userApi.service";
import { userApiRemoteService } from "../services/userApi.remote.service";
import { authMiddleware } from "./middlewares/auth.middleware";
export class userApiController {
  private auth: authMiddleware;
  constructor(private app: express.Application, private service: userApiService, private remoteService: userApiRemoteService) {
    this.auth = new authMiddleware(service);
    this.init();
  }
  init() {

    this.app.get("/test", (req, res) => {
      res.status(200).send("success");
    });

    this.app.post("/signup", async (req, res, next) => {
      try {
        const { FirstName, LastName, Email, AccountType, Password, ConfirmationPassword } = req.body || {};
        const Token = await this.service.signup(FirstName, LastName, Email, AccountType, Password, ConfirmationPassword);
        res.json({ Token, MaxAge: 60 * 60 * 24 * 10 });
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/signin", async (req, res, next) => {
      try {
        const { Email, Password } = req?.body || {};
        const Token = await this.service.signin(Email, Password);
        res.json({ Token, MaxAge: 60 * 60 * 24 * 10 });
      } catch (e: any) {
        next(e);
      }
    });

    this.app.get("/profile", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const profile = await this.service.profile(req.user._id);
        res.json(profile);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.get("/profile/createuploadurl", async (req: any, res: any, next: any) => {
      try {
        const resData = await this.service.CreateProfileUploadUrl();
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.put("/profile", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const { FirstName, LastName, Email, Img, Bio } = req.body || {};
        const User = await this.service.UpdateProfile(req.user._id, FirstName, LastName, Email, Img, Bio);
        res.status(200).json(User);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/profile/contact", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const { Title, Value } = req.body || {};
        const user = await this.service.AddContact(req.user._id, Title, Value);
        res.status(200).json(user);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.delete("/profile/contact", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const { ContactId } = req.body || {};
        const user = await this.service.DeleteContact(req.user._id, ContactId);
        res.status(200).json(user);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.post("/profile/address", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const { AddressType, Title, Country, City, State, Zip, StreetAddress } = req.body || {};
        const user = await this.service.setAddress(req.user._id, AddressType, Title, Country, City, State, Zip, StreetAddress);
        res.status(200).json(user);
      } catch (e: any) {
        next(e);
      }
    });

    this.app.delete("/profile/address", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const { AddressType } = req.body || {};
        const user = await this.service.DeleteAddress(req.user._id, AddressType);
        res.status(200).json(user);
      } catch (e: any) {
        next(e);
      }
    });
    this.app.post("/changepassword", this.auth.checkAuth.bind(this.auth), async (req: any, res: any, next: any) => {
      try {
        const { OldPassword, NewPassword, ConfirmationPassword } = req.body || {};
        const resData = await this.service.ChangePassword(req.user._id, OldPassword, NewPassword, ConfirmationPassword);
        res.status(200).json(resData);
      } catch (e: any) {
        next(e);
      }
    });
  }
}
