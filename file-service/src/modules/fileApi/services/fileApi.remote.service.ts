import { MSGQ } from "../../../utils";
import { APIError } from "../../../utils/app-errors";
export class fileApiRemoteServices {
  constructor(private msgq: MSGQ) {}

  async prodcastFile_Create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Files.Create", "DB-PRODCAST");
  }
}