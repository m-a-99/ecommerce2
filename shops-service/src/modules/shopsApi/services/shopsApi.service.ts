import { ShopsRepository } from "../../../database/repository/Shops-Repository";
import { adminService } from "../../../services/admin.service";
import { filesService } from "../../../services/files.service";
import { productsService } from "../../../services/products.service";
import { usersService } from "../../../services/users.service";
import { ArrToObj } from "../../../utils";
import { BadRequestError } from "../../../utils/app-errors";
import { shopsApiRemoteServic } from "./shopsApi.remote.service";

export class shopsApiService {
  constructor(private repository: ShopsRepository, private remoteService: shopsApiRemoteServic, private users_service: usersService, private admin_service: adminService, private files_service: filesService, private products_service: productsService) {}
  async getShops() {
    const shops = await this.repository.getShops();
    const [Users, ProductsCount] = await Promise.all([this.users_service.getUser(shops.map((v) => "" + v.Owner)), this.products_service.getShopProductsCountByIds(shops.map((v) => "" + v._id))]);
    return shops.map((shop: any) => ({ ...shop, Owner: Users["" + shop.Owner], ProductsCount: ProductsCount["" + shop._id].Count }));
  }

  async getShopById(Id: string) {
    const shop = await this.repository.getShopById(Id);
    if (!shop) {
      throw new BadRequestError(`shop with Id ${Id} not found`);
    }
    const ProductsCount = await this.products_service.getShopProductsCountByIds(["" + shop._id]);
    return { ...shop, ProductsCount: ProductsCount["" + shop._id].Count };
  }

  async updateShopById(Owner: any, ShopId: string, Logo: string, CoverImage: string, Name: string, Description: string, Active: boolean, City: string, Country: string, State: string, StreetAddress: string, Zip: string, AccountHolderEmail: string, AccountHolderName: string, AccountNumber: string, BankName: string, ContactNumber: string, Website: string, Latitude: number, Longtude: number) {
    const shop = await this.repository.UpdateShopById(Owner, ShopId, Logo, CoverImage, Name, Description, Active, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude);
    await this.remoteService.prodcastShops_Update(shop);
    return shop;
  }

  async getSelllerShops(SellerId: string) {
     const shops = await this.repository.getSellerShops(SellerId);
     const [Users, ProductsCount] = await Promise.all([this.users_service.getUser(shops.map((v) => "" + v.Owner)), this.products_service.getShopProductsCountByIds(shops.map((v) => "" + v._id))]);
     return shops.map((shop: any) => ({ ...shop, Owner: Users["" + shop.Owner], ProductsCount: ProductsCount["" + shop._id].Count }));
  }
  async createShopsUploadUrl() {
    const resData = await this.files_service.CreateUploadUrl({
      MaxTime: 10 * 60 * 1000,
      Fields: [
        { name: "Logo", maxCount: 1 },
        { name: "CoverImage", maxCount: 1 },
      ],
      Times: 1,
      AccessType: "public",
    });
    console.log(resData);
    return resData;
  }
  async createShop(Owner: string, Logo: string, CoverImage: string, Name: string, Description: string, Active: boolean, City: string, Country: string, State: string, StreetAddress: string, Zip: string, AccountHolderEmail: string, AccountHolderName: string, AccountNumber: string, BankName: string, ContactNumber: string, Website: string, Latitude: number, Longtude: number) {
    const FilesUrlsOrIds: any = {};
    Logo && (FilesUrlsOrIds.Logo = Logo);
    CoverImage && (FilesUrlsOrIds.CoverImage = CoverImage);
    (Logo || CoverImage) && (await this.files_service.FilesValidation(FilesUrlsOrIds));
    const shop = await this.repository.createShop(Owner, Logo, CoverImage, Name, Description, Active, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude);
    await this.remoteService.prodcastShops_Create(shop);
    return shop;
  }

  async getAttributes() {
    const attributes = await this.repository.getAttributes();
    return attributes;
  }

  async getAttributeById(attributeId: string) {
    const attribute = await this.repository.getAttributeById(attributeId);
    return attribute;
  }

  async editAttribute(Owner: any, AttributeId: string, ShopId: string, Name: string, AttributeValues: any, DeletedAttributeValuesIds: string[]) {
    const attribute = await this.repository.editAttribute(Owner, AttributeId, ShopId, Name, AttributeValues, DeletedAttributeValuesIds);
    await this.remoteService.prodcastAttributes_Update(attribute);
    return attribute;
  }

  async createAttribute(ShopId: string, Name: string, AttributeValues: any) {
    const attribute = await this.repository.createAttribute(ShopId, Name, AttributeValues);
    await this.remoteService.prodcastAttributes_Create(attribute);
    return attribute;
  }
  async getManufacturers() {
    const manufacturers = await this.repository.getManufacturers();
    const resData = await this.admin_service.JoinSocialPaltforms(manufacturers);
    return resData;
  }

  async getManufacturerById(id: string) {
    const manufacturers = await this.repository.getManufacturersByIds([id]);
    const resData = await this.admin_service.JoinSocialPaltforms(manufacturers);
    return resData[0];
  }

  async createManufacturer(Owner: any, Logo: string, CoverImage: string, ShopId: string, Name: string, Website: string, Description: string, Group: string, SocialProfiles: any[]) {
    await this.createManufacturerValidation(Owner, Logo, CoverImage, ShopId, Group, SocialProfiles);
    const Manufacturer = await this.repository.createManufacturer(Logo, CoverImage, ShopId, Name, Website, Description, Group, SocialProfiles);
    await this.remoteService.prodcastManufacturers_Create(Manufacturer);
    return Manufacturer;
  }
  async updateManufacturer(Owner: any, _id: string, Logo: string, CoverImage: string, ShopId: string, Name: string, Website: string, Description: string, Group: string, SocialProfiles: any[], DeletedSocialProfilesIds: any[]) {
    await this.updateManufacturerValidation(Owner, Logo, CoverImage, ShopId, Group, SocialProfiles, DeletedSocialProfilesIds);
    const Manufacturer = await this.repository.updateManufacturer(Owner, _id, Logo, CoverImage, ShopId, Name, Website, Description, Group, SocialProfiles, DeletedSocialProfilesIds);
    await this.remoteService.prodcastManufacturers_Update(Manufacturer);
    return Manufacturer;
  }

  private async updateManufacturerValidation(Owner: any, Logo: string, CoverImage: string, ShopId: string, Group: string, SocialProfiles: any[], DeletedSocialProfilesIds: string[]) {
    const FilesUrlsOrIds: any = {};
    Logo && (FilesUrlsOrIds.Logo = Logo);
    CoverImage && (FilesUrlsOrIds.CoverImage = CoverImage);
    if (Owner.AccountType === "Seller") {
      await Promise.all([this.files_service.FilesValidation(FilesUrlsOrIds), this.SotialProfilesValidation(SocialProfiles), this.admin_service.GroupsValidation([Group]), this.checkIsOwnerShopsExist(Owner._id, [ShopId])]);
    } else if (Owner.AccountType === "Admin") {
      await Promise.all([this.files_service.FilesValidation(FilesUrlsOrIds), this.SotialProfilesValidation(SocialProfiles), this.admin_service.GroupsValidation([Group])]);
    }
  }
  private async createManufacturerValidation(Owner: any, Logo: string, CoverImage: string, ShopId: string, Group: string, SocialProfiles: any[]) {
    const FilesUrlsOrIds: any = {};
    Logo && (FilesUrlsOrIds.Logo = Logo);
    CoverImage && (FilesUrlsOrIds.CoverImage = CoverImage);
    await Promise.all([this.files_service.FilesValidation(FilesUrlsOrIds), this.SotialProfilesValidation(SocialProfiles), this.admin_service.GroupsValidation([Group]), this.checkIsOwnerShopsExist(Owner._id, [ShopId])]);
  }
  async getAuthors() {
    const authors = await this.repository.getAuthors();
    const resData = await this.admin_service.JoinSocialPaltforms(authors);
    return resData;
  }

  async getAuthorById(id: string) {
    const author = await this.repository.getAuthorsByIds([id]);
    const resData = await this.admin_service.JoinSocialPaltforms(author);
    return resData[0];
  }

  async createAuthor(Image: string, Name: string, Languages: string, Bio: string, Quote: string, Born: string, Death: string, SocialProfiles: string[]) {
    Image && (await this.files_service.FilesValidation([Image]));
    await this.SotialProfilesValidation(SocialProfiles);
    const Auther = await this.repository.createAuthor(Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles);
    await this.remoteService.prodcastAuthors_Create(Auther);
    return Auther;
  }

  async updateAuthor(Owner: any, _id: string, Image: string, Name: string, Languages: string, Bio: string, Quote: string, Born: string, Death: string, SocialProfiles: any[], DeletedSocialProfilesIds: string[]) {
     Image && (await this.files_service.FilesValidation([Image]));
     await this.SotialProfilesValidation(SocialProfiles);
    const Author = await this.repository.updateAuthor(Owner, _id, Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles, DeletedSocialProfilesIds);
    await this.remoteService.prodcastAuthor_Update(Author);
    return Author
  }

  async createManufacturersUploadUrl() {
    const resData = await this.files_service.CreateUploadUrl({
      Times: 1,
      MaxTime: 10 * 60 * 100,
      Fields: [
        { name: "Logo", maxCount: 1 },
        { name: "CoverImage", maxCount: 1 },
      ],
      AccessType: "public",
    });
    return resData;
  }

  async createAuthorsUploadUrl() {
    const resData = await this.files_service.CreateUploadUrl({
      Times: 1,
      MaxTime: 10 * 60 * 100,
      Fields: [{ name: "Image", maxCount: 1 }],
      AccessType: "public",
    });
    return resData;
  }

  async checkIsShopsExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Shop", async (Ids: string[]) => await this.repository.getShopsByIds(Ids));
  }
  async checkIsOwnerShopsExist(Owner: string, Ids: string[]) {
    try {
      return await this.CheckExist(Ids, "Shop", async (Ids: string[]) => await this.repository.getOwnerShopsByIds(Owner, Ids));
    } catch (e: any) {
      throw new BadRequestError(e.message + " for Owner " + Owner);
    }
  }

  async checkAuth(token: string) {
    return await this.users_service.checkAuth(token);
  }
  private async CheckExist(Ids: string[], FieldName: string, cb: any) {
    for (let Id of Ids) {
      if (typeof Id !== "string") {
        throw new BadRequestError(`${Id} invalid ${FieldName} Id`);
      }
    }
    try {
      const Data = ArrToObj(await cb(Ids), "_id");
      for (let Id of Ids) {
        if (!Data[Id]) {
          throw new BadRequestError(`${FieldName} with ${Id} Id dose not Exist`);
        }
      }
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  private async SotialProfilesValidation(SocialProfiles: any[]) {
    if (SocialProfiles && SocialProfiles.length > 0) {
      for (let i = 0; i < SocialProfiles.length; i++) {
        if (!SocialProfiles[i].SocialMediaPlatform) {
          throw new BadRequestError("profile " + (i + 1) + " invalid SocialMediaPlatform value");
        }
        if (!SocialProfiles[i].Url) {
          throw new BadRequestError("profile " + (i + 1) + " invalid Url value");
        }
      }
      await this.admin_service.SotialProfilesValidation([...SocialProfiles.map((v) => v.SocialMediaPlatform)]);
    }
  }
}
