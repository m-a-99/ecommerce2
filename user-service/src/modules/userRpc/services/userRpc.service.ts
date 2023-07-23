import { UserRepository } from "../../../database";
import { ArrToObj, verify_token } from "../../../utils";
import { MSGQError } from "../../../utils/app-errors";

export class userRpcService {
  private repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }
  async ResolveUserByToken(token:string) {
    let decoded_token = verify_token(token.replace("%20"," ").split(" ")[1]);
    const user = await this.repository.getUserById(decoded_token);
    return user;
  }
  async GetUsersByIds(Ids:string[]){
    const users=await this.repository.getUsersByIds(Ids)
    const usersObj=ArrToObj(users,"_id");
    return usersObj;
  }
}
