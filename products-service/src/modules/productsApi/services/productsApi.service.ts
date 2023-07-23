import { productsRepository } from "../../../database";
import { BadRequestError, UnauthorizedError } from "../../../utils/app-errors";
import { adminService } from "../../../services/admin.service";
import { filesService } from "../../../services/files.service";
import { shopsService } from "../../../services/shops.service";
import { usersService } from "../../../services/users.service";
import { productsApiRemoteService } from "./productsApi.remote.service";
import { ArrToObj } from "../../../utils";
import { SimpleProductType, VariableProductVarientType } from "../../../database/models";

export class productsApiService {
  private repository: productsRepository;
  constructor(private remoteService: productsApiRemoteService, private users_service: usersService, private admin_service: adminService, private files_service: filesService, private shops_service: shopsService) {
    this.repository = new productsRepository();
  }
  async getproducts(UserId: string, Page: number) {
    const products = await this.repository.getproducts(UserId, Page);
    return products;
    //return await this.remoteService.ProductsJoin(products);
  }
  async getSellerProducts(UserId: string) {
    return await this.repository.getSellerProducts(UserId);
  }
  async getAdminProducts() {
    return await this.repository.getAdminProducts();
  }
  async getproductById(productId: string) {
    const product = await this.repository.getproductById(productId);
    //return await this.remoteService.ProductsJoin([product]);
    return product;
  }

  async getSellerProductById(UserId: string, productId: string) {
    const product = await this.repository.getSellerProductById(UserId, productId);
    return product;
  }

  async createProduct(FeaturedImage: string, Gallery: string[], Owner: string, ShopId: string, Group: string, Categories: string[], Authors: string[], Manufacturers: string[], Tags: string[], Name: string, Description: string, Unit: string, Status: string, ProductType: string, SimpleProduct: any, VariableProduct: any) {
    await this.#createProductValidation(FeaturedImage, Gallery, Owner, ShopId, Group, Categories, Authors, Manufacturers, Tags, SimpleProduct, VariableProduct);
    const product = await this.repository.createProduct(FeaturedImage, Gallery, ShopId, Group, Categories, Authors, Manufacturers, Tags, Name, Description, Unit, Status, ProductType, SimpleProduct, VariableProduct);
    return product;
  }

  async editProduct(
    ProductId: string,
    State: string,
    Message: string,
    FeaturedImage: string,
    Gallery: string[],
    Owner: any,
    ShopId: string,
    Group: string,
    Categories: string[],
    Authors: string[],
    Manufacturers: string[],
    Tags: string[],
    Name: string,
    Description: string,
    Unit: string,
    Status: string,
    ProductType: string,
    SimpleProduct: SimpleProductType,
    VariableProduct: VariableProductVarientType[]
  ) {
    if (!ProductId) {
      throw new BadRequestError("invalid product id");
    }
    if (Owner.AccountType === "Seller") {
      if (State || Message) {
        throw new UnauthorizedError("Seller not authorized to change product State or Message");
      }
      State = "Pending";
      Message = "Pending due to Product Updates";
    }
    if (Owner.AccountType === "Admin" && ShopId) {
      throw new UnauthorizedError("Admin not authorized to change product shop");
    }

    await this.editProductValidation(FeaturedImage, Gallery, Owner, ShopId, Group, Categories, Authors, Manufacturers, Tags, SimpleProduct, VariableProduct);
    const product = await this.repository.editProduct(ProductId, State, Message,  FeaturedImage, Gallery, ShopId, Group, Categories, Authors, Manufacturers, Tags, Name, Description, Unit, Status, ProductType, SimpleProduct, VariableProduct);
    return product;
  }

  async createProductUploadUrl(Varients: number) {
    const Fields = [
      { name: "FeaturedImage", maxCount: 1 },
      { name: "Gallery", maxCount: 50 },
      { name: `DigitalProductFile`, maxCount: 1 },
    ];
    for (let i = 1; i <= Varients; i++) {
      Fields.push({ name: `Varient${i}Image`, maxCount: 1 });
      Fields.push({ name: `Varient${i}DigitalProductFile`, maxCount: 1 });
    }
    return await this.files_service.CreateUploadUrl({
      Times: 1,
      AccessType: "public",
      Fields: Fields,
      MaxTime: 10 * 60 * 1000,
    });
  }

  // async #createProductValidation(FeaturedImage: string, Gallery: string[], ShopId: string, Group: string, Categories: string[], Authors: string[], Manufacturers: string[], Tags: string[], SimpleProduct: any, VariableProduct: any) {
  //   const Files: any = {};
  //   FeaturedImage && (Files.FeaturedImage = FeaturedImage);
  //   if (Gallery) {
  //     if (!Array.isArray(Gallery)) throw new BadRequestError("Gallery Must Be an Array");
  //     Gallery.forEach((v, index) => (Files["Gallery" + (index + 1)] = v));
  //   }
  //   if (SimpleProduct && SimpleProduct.IsDigital) {
  //     Files.DigitalProdufctFile = SimpleProduct.DigitalProductFile;
  //   } else if (VariableProduct) {
  //     VariableProduct.forEach((e: any, i: number) => {
  //       e.Image && (Files[`Varient${i + 1}Image`] = e.Image);
  //       e.IsDigital && e.DigitalProductFile && (Files[`Varient${i + 1}DigitalProductFile`] = e.DigitalProductFile);
  //     });
  //   }
  //   await Promise.all([this.files_service.FilesValidation(Files), this.admin_service.GroupsValidation([Group]), this.admin_service.CategoriesValidation(Categories), this.shops_service.AuthorsValidation(Authors), this.shops_service.ManufacturersValidation(Manufacturers), this.admin_service.TagsValidation(Tags),this.shops_service.ShopsValidation([ShopId])]);
  // }
  async #createProductValidation(FeaturedImage: string, Gallery: string[], Owner: string, ShopId: string, Group: string, Categories: string[], Authors: string[], Manufacturers: string[], Tags: string[], SimpleProduct: any, VariableProduct: any) {
    const Files: any = {};
    FeaturedImage && (Files.FeaturedImage = FeaturedImage);
    if (Gallery) {
      if (!Array.isArray(Gallery)) throw new BadRequestError("Gallery Must Be an Array");
      Gallery.forEach((v, index) => (Files["Gallery" + (index + 1)] = v));
    }
    if (SimpleProduct && SimpleProduct.IsDigital) {
      Files.DigitalProdufctFile = SimpleProduct.DigitalProductFile;
    } else if (VariableProduct) {
      VariableProduct.forEach((e: any, i: number) => {
        e.Image && (Files[`Varient${i + 1}Image`] = e.Image);
        e.IsDigital && e.DigitalProductFile && (Files[`Varient${i + 1}DigitalProductFile`] = e.DigitalProductFile);
      });
    }
    // await Promise.all([this.files_service.FilesValidation(Files), this.admin_service.GroupsValidation([Group]), this.admin_service.CategoriesValidation(Categories), this.shops_service.AuthorsValidation(Authors), this.shops_service.ManufacturersValidation(Manufacturers), this.admin_service.TagsValidation(Tags), this.shops_service.ShopsValidation([ShopId])]);
    await Promise.all([this.checkIsFilesExist(Files), this.checkIsGroupsExist([Group]), this.checkIsCategoriesExist(Categories), this.checkIsAuthorsExist(Authors), this.checkIsManufacturersExist(Manufacturers), this.checkIsTagsExist(Tags), this.checkIsOwnerShopsExist(Owner, [ShopId])]);
  }

  private async editProductValidation(FeaturedImage: string, Gallery: string[], Owner: any, ShopId: string, Group: string, Categories: string[], Authors: string[], Manufacturers: string[], Tags: string[], SimpleProduct: any, VariableProduct: any) {
    const Files: any = {};
    FeaturedImage && (Files.FeaturedImage = FeaturedImage);
    if (Gallery) {
      if (!Array.isArray(Gallery)) throw new BadRequestError("Gallery Must Be an Array");
      Gallery.forEach((v, index) => (Files["Gallery" + (index + 1)] = v));
    }
    if (SimpleProduct && SimpleProduct.IsDigital) {
      Files.DigitalProdufctFile = SimpleProduct.DigitalProductFile;
    } else if (VariableProduct) {
      VariableProduct.forEach((e: any, i: number) => {
        e.Image && (Files[`Varient${i + 1}Image`] = e.Image);
        e.IsDigital && e.DigitalProductFile && (Files[`Varient${i + 1}DigitalProductFile`] = e.DigitalProductFile);
      });
    }
    // await Promise.all([this.files_service.FilesValidation(Files), this.admin_service.GroupsValidation([Group]), this.admin_service.CategoriesValidation(Categories), this.shops_service.AuthorsValidation(Authors), this.shops_service.ManufacturersValidation(Manufacturers), this.admin_service.TagsValidation(Tags), this.shops_service.ShopsValidation([ShopId])]);
    if (Owner.AccountType === "Admin") {
      await Promise.all([this.checkIsFilesExist(Files), this.checkIsGroupsExist([Group]), this.checkIsCategoriesExist(Categories), this.checkIsAuthorsExist(Authors), this.checkIsManufacturersExist(Manufacturers), this.checkIsTagsExist(Tags)]);
    } else {
      await Promise.all([this.checkIsFilesExist(Files), this.checkIsGroupsExist([Group]), this.checkIsCategoriesExist(Categories), this.checkIsAuthorsExist(Authors), this.checkIsManufacturersExist(Manufacturers), this.checkIsTagsExist(Tags), this.checkIsOwnerShopsExist(Owner._id, [ShopId])]);
    }
  }

  async checkAuth(token: string) {
    return await this.users_service.checkAuth(token);
  }

  async getWishList(UserId: string) {
    if (!UserId) {
      throw new UnauthorizedError("login required");
    }
    return await this.repository.getWishList(UserId);
  }

  async checkIsAttributesExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Attribute", async (Ids: string[]) => await this.repository.getAttributesByIds(Ids));
  }
  async checkIsManufacturersExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Manufacturer", async (Ids: string[]) => await this.repository.getManufacturersByIds(Ids));
  }
  async checkIsAuthorsExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Author", async (Ids: string[]) => await this.repository.getAuthorsByIds(Ids));
  }

  async checkIsSocioalMediaPlatformExist(Ids: any) {
    return await this.CheckExist(Ids, "SocialMediasPlatform", async (Ids: any) => await this.repository.getSocialMediaPlatformsByIds(Ids));
  }
  async checkIsTagsExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Tag", async (Ids: string[]) => await this.repository.getTagsByIds(Ids));
  }
  async checkIsGroupsExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Group", async (Ids: string[]) => await this.repository.getGroupsByIds(Ids));
  }
  async checkIsCategoriesExist(Ids: string[]) {
    return await this.CheckExist(Ids, "Category", async (Ids: string[]) => await this.repository.getCategoriesByIds(Ids));
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

  async checkIsFilesExist(Ids: string[]) {
    return await this.CheckExist(
      Object.values(Ids).map((v) => v.split("/file/")[1]),
      "Files",
      async (Ids: string[]) => await this.repository.GetFilesByIds(Ids)
    );
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
}
