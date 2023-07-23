import express from "express";
import { authMiddleWare } from "./middlewares/auth.middlewares";
import { MSGQ } from "../../../utils";
import { fileApiServices } from "../services/fileApi.service";
import { NotFoundError, UnauthorizedError } from "../../../utils/app-errors";
import { filesMiddlewares } from "./middlewares/files.middlewares";
declare module "express" {
  interface Request {
    user: string | null;
    files: any;
    UrlMetaData:any
  }
}
export class fileApiController {
  private auth: authMiddleWare;

  constructor(private app: express.Application, private msgq: MSGQ, private service: fileApiServices) {
    this.auth = new authMiddleWare(service);
    this.init()
  }
  init() {
    this.app.get("/test", (req, res) => {
      res.status(200).send("success");
    });
    this.app.get("/file/:id", this.auth.checkAuth.bind(this.auth), async (req:any, res, next) => {
     try{
       const { id } = req.params;
      const file = await this.service.GetFileById(id, req.user);
      res.sendFile(file.Path);
     }catch(e:any){
      next(e)
     }
    });

    this.app.post("/upload/:urlId", filesMiddlewares.UloadFilesMiddleWare(this.service), async (req:any, res, next) => {
      try {
            const resData:any = {};
            for (let j = 0; j < Object.keys(req.files).length; j++) {
              let key = Object.keys(req.files)[j];
              const keypaths:any[] = [];
              for (let i = 0; i < req.files[key].length; i++) {
                const file = req.files[key][i];
                const _file = await this.service.CreateFile(file.path, file.originalname, file.mimetype, req.UrlMetaData.AccessType, req.UrlMetaData.AccessUsers);
                keypaths.push("/file-service/file/" + _file._id);
              }
              resData[key] = keypaths;
        }
        res.status(200).json(resData);
      } catch (e:any) {
        next(e);
      }
    });
  }
}
