import { FilesRepository } from "../../../database";

export class filesRpcService {

  constructor(private repository: FilesRepository) {}
  CreateUrl(Feilds:string[], Times: number, Maxtime: number, AccessType:string, AccessUsers:string[]) {
    const urlId = this.repository.CreateUrl(Feilds, Times, Maxtime, AccessType, AccessUsers);
    return urlId;
  }

  async CheckisFilesExist(FilesUrlsOrIds:string[]) {
    const files :any= {};
    for (const key in FilesUrlsOrIds) {
      let fileUrlOrId = FilesUrlsOrIds[key];
      if (!fileUrlOrId || typeof fileUrlOrId === "string") {
        files[key] = { Value: FilesUrlsOrIds[key], Exist: false, message: "Invalid url or id" };
      }
      if (fileUrlOrId.includes("/file-service/file/")) {
        fileUrlOrId = fileUrlOrId.split("/file-service/file/")[1];
      }
      try {
        const file = await this.repository.GetFileById(fileUrlOrId);
        if (!file) {
          files[key] = { Value: FilesUrlsOrIds[key], Exist: false, message: "Invalid url or id , file not found " };
        } else {
          files[key] = { Value: FilesUrlsOrIds[key], Exist: true };
        }
      } catch (e:any) {
        files[key] = { Value: FilesUrlsOrIds[key], Exist: false, message: "Invalid url or id , " + e.message };
      }
    }
    return files;
  }
}