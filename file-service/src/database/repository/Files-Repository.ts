import { APIError, BadRequestError } from "../../utils/app-errors";
import { FilesModel } from "../models";
import {v4} from "uuid"
export class FilesRepository {
  private static uploadurls = new Map();
  async CreateFile(Path: string, OriginalName: string, Mimetype: string, AccessType: string, AccessUsers: string[]) {
    try {
      const file = new FilesModel({
        Path,
        OriginalName,
        Mimetype,
        AccessType,
        AccessUsers,
      });
      await file.save();
      return file;
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }

  CreateUrl(Feilds: string[], Times: number, Maxtime: number, AccessType: string, AccessUsers: string[]) {
    const urlId = v4();
    FilesRepository.uploadurls.set(urlId, { urlId, Feilds, Times: Times || 1, AccessType, AccessUsers });
    setTimeout(() => {
      FilesRepository.uploadurls.delete(urlId);
    }, Maxtime || 5 * 60 * 1000);
    return urlId;
  }
  GetUrlMetaData(urlId:string) {
    console.log()
    let UrlFeilds = FilesRepository.uploadurls.get(urlId);
    if (!UrlFeilds) {
      return undefined;
    }
    if (UrlFeilds && UrlFeilds.Times <= 0) {
      FilesRepository.uploadurls.delete(urlId);
      return undefined;
    }
    UrlFeilds.Times--;
    FilesRepository.uploadurls.set(urlId, UrlFeilds);
    return UrlFeilds;
  }
  async GetFileById(id:string) {
    try {
      const file = await FilesModel.findById(id);
      return file;
    } catch (e:any) {
      throw new APIError("get file error", e.message);
    }
  }
}

