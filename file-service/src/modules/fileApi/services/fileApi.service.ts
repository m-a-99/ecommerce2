import mongoose from "mongoose";
import { FilesRepository } from "../../../database";
import { NotFoundError, UnauthorizedError } from "../../../utils/app-errors";
import { fileApiRemoteServices } from "./fileApi.remote.service";
import { usersService } from "../../../services/users.service";

export class fileApiServices {
  constructor(private repository: FilesRepository,private remoteService:fileApiRemoteServices,private users_service:usersService) {}
  async CreateFile(Path:string, OriginalName:string, Mimetype:string, AccessType:string, AccessUsers:string[]) {
    const file= await this.repository.CreateFile(Path, OriginalName, Mimetype, AccessType, AccessUsers);
    await this.remoteService.prodcastFile_Create(file)
    return file;
  }
  CreateUrl(Feilds:string[], Times:number, Maxtime:number, AccessType:string, AccessUsers:string[]) {
    const urlId = this.repository.CreateUrl(Feilds, Times, Maxtime, AccessType, AccessUsers);
    return urlId;
  }
  GetUrlMetaData(id:string) {
    const Feilds = this.repository.GetUrlMetaData(id);
    return Feilds;
  }
  
  async GetFileById(id:string, userId:string) {
    const file = await this.repository.GetFileById(id);
    if (!file) {
      throw new NotFoundError(`File By Id ${id} Not Found`);
    }
    if (file.AccessType === "private") {
      if (!userId) {
        throw new UnauthorizedError("This file is protected access denied");
      }
      if (!file.AccessUsers.includes(new mongoose.Types.ObjectId(userId))) {
        throw new UnauthorizedError("Authorization Error ");
      }
    }
    return file;
  }
  async checkAuth(token:string){
    return await this.users_service.checkAuth(token)
  }
  
}
