import { userApiService } from "../../services/userApi.service";
const { UnauthorizedError } = require("../../../../utils/app-errors");

export class authMiddleware {
  constructor(private service: userApiService) {}
  async checkAuth(req:any, res:any, next:any) {
    try {
      const { Authorization, authorization } = req.headers || {};
      let token = authorization || Authorization;
      token && (token = token.replace("%20", " "));
      if (!token) {
        throw new UnauthorizedError("This Route Is Protected User Must Login To Proceed");
      }
      req.user = await this.service.ResolveUserByToken(token);
      if (!req.user) {
        throw new UnauthorizedError("Access Denied You Must Login");
      }
      next();
    } catch (e:any) {
      next(e);
    }
  }
}
