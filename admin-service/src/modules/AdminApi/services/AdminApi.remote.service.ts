import { MSGQ } from "../../../utils";
import { APIError, BadRequestError } from "../../../utils/app-errors";

export class RemoteService {
  constructor(private msgq: MSGQ) {}

  async prodcastGroup_create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Groups.Create", "DB-PRODCAST");
  }
  async prodcastCategory_create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Categories.Create", "DB-PRODCAST");
  }
  async prodcastCategory_Update(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Categories.Update", "DB-PRODCAST");
  }

  async prodcastIcon_create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Icons.Create", "DB-PRODCAST");
  }

  async prodcastIcon_update(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Icons.Update", "DB-PRODCAST");
  }
  async prodcastTag_create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Tags.Create", "DB-PRODCAST");
  }
  async prodcastTag_update(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Tags.Update", "DB-PRODCAST");
  }
  async prodcastSocialmediaPlatform_create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "SocialMediaPlatforms.Create", "DB-PRODCAST");
  }
  async prodcastSocialmediaPlatform_update(data: any) {
    await this.msgq.emit(JSON.stringify(data), "SocialMediaPlatforms.Update", "DB-PRODCAST");
  }
}
