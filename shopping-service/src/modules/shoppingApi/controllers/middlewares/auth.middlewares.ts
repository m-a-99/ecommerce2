import { UnauthorizedError } from "../../../../utils/app-errors";
import { ErrorLogger } from "../../../../utils/error-handler";
import { shoppingApiService } from "../../services/shoppingApi.service";
export class authMiddleWare {
  constructor(private service: shoppingApiService) {}
  async checkAuth(req: any, res: any, next: any) {
    try {
      const { Authorization: heddertoken } = req.headers || {};
      const { authorization: heddertoken2 } = req.headers || {};
      const { jwt: cookietoken } = req.cookies || {};
      const token = heddertoken || cookietoken || heddertoken2;
      if (!token) {
        return next();
      }
      const resData = await this.service.checkAuth(token);
      req.user = resData;
      return next();
    } catch (e: any) {
      const logger = new ErrorLogger();
      logger.logError(e);
      return next();
    }
  }
  checkAdmin(req: any, res: any, next: any) {
    try {
      if (!req?.user || !req?.user?._id) {
        throw new UnauthorizedError("Authentication Error Login Required");
      }
      if (req?.user?.AccountType !== "Admin") {
        throw new UnauthorizedError("Authorization Error this route protected only req from Admin accounts are allowed");
      }
      return next();
    } catch (e: any) {
      return next(e);
    }
  }
  checkSeller(req: any, res: any, next: any) {
    try {
      if (!req?.user || !req?.user?._id) {
        throw new UnauthorizedError("Authentication Error Login Required");
      }
      if (req?.user?.AccountType !== "Seller") {
        throw new UnauthorizedError("Authorization Error this route protected only req from sellers accounts are allowed");
      }
      return next();
    } catch (e: any) {
      next(e);
    }
  }
  checkAdminOrSeller(req: any, res: any, next: any) {
    try {
      if (!req?.user || !req?.user?._id) {
        throw new UnauthorizedError("Authentication Error Login Required");
      }
      if (req?.user?.AccountType !== "Admin" && req?.user?.AccountType !== "Seller") {
        throw new UnauthorizedError("Authorization Error this route protected only req from Admin or Sellers accounts are allowed");
      }
      return next();
    } catch (e: any) {
      return next(e);
    }
  }
}
