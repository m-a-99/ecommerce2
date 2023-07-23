import { MSGQ } from "../../../utils";
import { APIError, BadRequestError } from "../../../utils/app-errors";

export class shopsApiRemoteServic {
  constructor(private msgq: MSGQ) {}
  async prodcastShops_Create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Shops.Create", "DB-PRODCAST");
  }
  async prodcastShops_Update(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Shops.Update", "DB-PRODCAST");
  }
  async prodcastAttributes_Create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Attributes.Create", "DB-PRODCAST");
  }
  async prodcastAttributes_Update(data: any) {
    await this.msgq.emit(JSON.stringify(data), "Attributes.Update", "DB-PRODCAST");
  }
  async prodcastManufacturers_Create(data: any) {
    this.msgq.emit(JSON.stringify(data), "Manufacturers.Create", "DB-PRODCAST");
  }
  async prodcastManufacturers_Update(data: any) {
    this.msgq.emit(JSON.stringify(data), "Manufacturers.Update", "DB-PRODCAST");
  }
  async prodcastAuthors_Create(data: any) {
    this.msgq.emit(JSON.stringify(data), "Authors.Create", "DB-PRODCAST");
  }
  async prodcastAuthor_Update(data:any){
    this.msgq.emit(JSON.stringify(data), "Authors.Update","DB-PRODCAST");
  }
}
