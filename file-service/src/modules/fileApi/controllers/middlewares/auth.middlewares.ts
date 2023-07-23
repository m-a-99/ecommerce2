import { ErrorLogger } from "../../../../utils/error-handler";
import { fileApiServices } from "../../services/fileApi.service";
export class authMiddleWare {
  constructor(private service: fileApiServices) {}
  async checkAuth(req: any, res: any, next: any) {
    try {
      const { Authorization: heddertoken } = req.headers || {};
      const { jwt: cookietoken } = req.cookies || {};
      const token = heddertoken || cookietoken;
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
}
