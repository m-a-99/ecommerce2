import multer from "multer";
import { APIError, BadRequestError, NotFoundError, STATUS_CODES, UnauthorizedError } from "../../../../utils/app-errors";
import { multerUpload } from "../../../../utils";
import { fileApiServices } from "../../services/fileApi.service";

export class filesMiddlewares {
  static UloadFilesMiddleWare(service: fileApiServices) {
    return (req:any, res:any, next:any) => {
      try {
        const { urlId } = req.params;
        const GetUrlMetaData = service.GetUrlMetaData(urlId);
        if (!GetUrlMetaData) {
          throw new BadRequestError("invalid upload url id");
        }
        req.UrlMetaData = GetUrlMetaData;
        multerUpload.fields(GetUrlMetaData.Feilds)(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return next(new APIError("multer error ", err.message, STATUS_CODES.INTERNAL_ERROR));
          } else if (err) {
            return next(new APIError("error ", err.message, STATUS_CODES.INTERNAL_ERROR, true));
          } else {
            next();
          }
        });
      } catch (e:any) {
        next(e);
      }
    };
  }
}
