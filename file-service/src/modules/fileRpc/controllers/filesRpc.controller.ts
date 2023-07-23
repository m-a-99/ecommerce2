import { MSGQ } from "../../../utils";
import { filesRpcService } from "../services/filesRpc.service";

export class fileRpcController{
    constructor(private service:filesRpcService,private msgq:MSGQ){
        this.init()
    }
    init(){
        
        this.msgq.Rigester("CreateUplpoadUrl", async (msg) => {
          const { Fields, Times, MaxTime, AccessType, AccessUsers } = JSON.parse(msg);
          const urlId = this.service.CreateUrl(Fields, Times, MaxTime, AccessType, AccessUsers);
          const data = { UploadUrl: `/file-service/upload/${urlId}`, Method: "POST", Fields, Times, MaxTime, AccessType };
          return data
        });

        this.msgq.Rigester("CheckisFilesExist", async (msg) => {
          const { FilesUrlsOrIds } = JSON.parse(msg);
          const Files = await this.service.CheckisFilesExist(FilesUrlsOrIds);
          return{ Files };
        });

    }
}