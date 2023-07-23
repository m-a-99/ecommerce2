import { productsRepository } from "../../../database";
import { ArrToObj } from "../../../utils";
import { BadRequestError } from "../../../utils/app-errors";
import { productsApiRemoteService } from "../../productsApi/services/productsApi.remote.service";

export class productsRpcService {
  private repository: productsRepository;
  constructor(private remoteService: productsApiRemoteService) {
    this.repository = new productsRepository();
  }

  async RPCCheckIsProductsExistByIds(Ids: string[]) {
    const resData: any = [];
    const products = await Promise.allSettled(Ids.map((Id) => this.repository.getproductById(Id)));
    products.forEach((product, index) => {
      if (product.status === "rejected") {
        resData.push({ Value: Ids[index], Exist: false, message: product.reason });
      } else {
        if (!product.value) {
          resData.push({ Value: Ids[index], Exist: false, message: `Product with ${Ids[index]} Id dose not Exist` });
        } else {
          resData.push({ Value: Ids[index], Exist: true });
        }
      }
    });
    return resData;
  }
  async RPCCheckIsProductsExist(Products: any) {
    const resData: any = [];
    for (let Product of Products) {
      if (!Product.ProductId) {
        resData.push({ Value: Product.ProductId, Exist: false, message: `${Product.ProductId} invalid Product Id` });
      }
      try {
        const Data: any = await this.repository.getproductById(Product.ProductId);
        if (!Data) {
          resData.push({ Value: Product.ProductId, Exist: false, message: `Product with ${Product.ProductId} Id dose not Exist` });
        } else {
          if (Product.ProductType === "Variable") {
            const Data2 = await this.repository.getProductByIdAndVariableId(Product.ProductId, Product.VariableId);
            if (!Data2) {
              resData.push({ Value: Product.ProductId, Exist: false, message: `Product with ${Product.ProductId} Id dose not have VarableProduct with ${Product.VariableId} Id` });
            } else {
              resData.push({ Value: Product.ProductId, Exist: true });
            }
          } else {
            resData.push({ Value: Product.ProductId, Exist: true });
          }
        }
      } catch (e: any) {
        resData.push({ Value: Product.ProductId, Exist: false, message: e.message });
      }
    }
    return resData;
  }

  async RPCGetProductsByIds(Ids: string[]) {
    const Products = await this.repository.getProductsByIds(Ids);
    //const resData = await this.remoteService.ProductsJoin(Products);
    return this.#RPCGetbyIdsFormat(Products);
  }

  async #RPCGetbyIdsFormat(data: any) {
    const resData: any = {};
    data.forEach((v: any) => {
      resData[v._id] = v;
    });
    return resData;
  }

  async RPCgetShopProductsCountByIds(Ids: string[]) {
    const count = await this.repository.getShopProductsCountByIds(Ids);
    return ArrToObj(count, "_id");
  }

  async createFileSubscriber(data: any) {
    try {
      const { _id, Path, OriginalName, Mimetype, AccessType, AccessUsers } = data;
      const File = await this.repository.CreateFile(_id, Path, OriginalName, Mimetype, AccessType, AccessUsers);
      return File;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createGroupSubscriber(data: any) {
    try {
      const { _id, Name, Icon, Layout, ProductCard, PromotionalSliders, Banners } = data;
      const group = await this.repository.createGroup(_id, Name, Icon, Layout, ProductCard, PromotionalSliders, Banners);
      return group;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createCategorySubscriber(data: any) {
    try {
      const { _id, Name, Details, Icon, Group, SubCategories } = data;
      const category = await this.repository.createCategory(_id, Name, Details, Icon, Group, SubCategories);
      return category;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateCategorySubscriber(data: any) {
    try {
      const { _id, Name, Details, Icon, Group, SubCategories } = data;
      const category = await this.repository.updateCategoryById(_id, Name, Details, Icon, Group, SubCategories);
      return category;
    } catch (e: any) {}
  }

  async createIconSubscriber(data: any) {
    try {
      const { _id, Name, Url } = data;
      const icon = await this.repository.createIcon(_id, Name, Url);
      return icon;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateIconSubscriber(data: any) {
    try {
      const { _id, Name, Url } = data;
      const icon = await this.repository.updateIconById(_id, Name, Url);
      return icon;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createTagSubscriber(data: any) {
    try {
      const { _id, Name, Details, Icon, Group } = data;
      const tag = await this.repository.createTag(_id, Name, Details, Icon, Group);
      return tag;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateTagSubscriber(data: any) {
    try {
      const { _id, Name, Details, Icon, Group } = data;
      const tag = await this.repository.updateTagById(_id, Name, Details, Icon, Group);
      return tag;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createSocialMediaPlatformSubscriber(data: any) {
    try {
      const { _id, Icon, Name } = data;
      const sotial = await this.repository.createSocialMediaPlatform(_id, Icon, Name);
      return sotial;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateSocialMediaPlatformSubscriber(data: any) {
    const { _id, Name, Icon } = data;
    const sotial = await this.repository.updateSocialMediaPlatform(_id, Name, Icon);
    return sotial;
  }
  // createAttribute;
  //   createManufacturer;
  //   createAuthor;

  async createAttributeSubscriber(data: any) {
    try {
      const { _id, Name, ShopId, AttributeValues } = data;
      const attribute = await this.repository.createAttribute(_id, Name, ShopId, AttributeValues);
      return attribute;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateAttribuesSubscriber(data: any) {
    try {
      const { _id, Name, ShopId, AttributeValues, DeletedAttributeValuesIds } = data;
      const attribute = await this.repository.updateAttribute(_id, Name, ShopId, AttributeValues, DeletedAttributeValuesIds);
      return attribute;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createManufactureSubscriber(data: any) {
    try {
      const { _id, Logo, CoverImage, Name, Website, Description, Group, SocialProfiles } = data;
      const Manufacture = await this.repository.createManufacturer(_id, Logo, CoverImage, Name, Website, Description, Group, SocialProfiles);
      return Manufacture;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateManufactureSubscriber(data: any) {
    try {
      const { _id, Logo, CoverImage, Name, Website, Description, Group, SocialProfiles } = data;
      const Manufacture = await this.repository.updateManufacturer(_id, Logo, CoverImage, Name, Website, Description, Group, SocialProfiles);
      return Manufacture;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createAuthorSubscriber(data: any) {
    try {
      const { _id, Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles } = data;
      const Author = await this.repository.createAuthor(_id, Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles);
      return Author;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateAuthorSubscriber(data: any) {
    try {
      const { _id, Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles } = data;
      const author = await this.repository.updateAuthor(_id, Image, Name, Languages, Bio, Quote, Born, Death, SocialProfiles);
      return author;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createWishSubscriber(data: any) {
    try {
      const { _id, UserId, ProductId } = data;
      const wish = await this.repository.createWish(_id, UserId, ProductId);
      return wish;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createShopsSubscriber(data: any) {
    try {
      const { _id, Owner, Logo, CoverImage, Name, Active, Description, Address, PaymentInfo, ShopSettings } = data;
      const shop = await this.repository.createShop(_id, Owner, Logo, CoverImage, Name, Active, Description, Address, PaymentInfo, ShopSettings);
      return shop;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateShopsSubscriber(data: any) {
    try {
      const { _id, Owner, Logo, CoverImage, Name, Active, Description, Address, PaymentInfo, ShopSettings } = data;
      const shop = await this.repository.updateShop(_id, Owner, Logo, CoverImage, Name, Active, Description, Address, PaymentInfo, ShopSettings);
      return shop;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async deleteWishSubscriber(data: any) {
    try {
      const { UserId, ProductId } = data;
      const wish = await this.repository.removeWish(UserId, ProductId);
      return wish;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
}
