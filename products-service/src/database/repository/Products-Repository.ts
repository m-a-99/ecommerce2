import mongoose from "mongoose";
import { APIError, BadRequestError, UnauthorizedError } from "../../utils/app-errors";
import { AttributesModel, AttributesValuesModel, AuthorsModel, CategoriesModel, FilesModel, GroupsModel, IconsModel, MainGroupModel, ManufacturersModel, ProductsModel, ProductsType, ShopsModel, SimpleProductType, SocialMediaPlatformsModel, TagsModel, VariableProductVarientType, WishListModel } from "../models";
import { ArrToObj } from "../../utils";
import { SubCategoriesType } from "../models/Categories";

export class productsRepository {
  /************************************************************************ */
  /************************************************************************ */
  /************************************************************************ */

  async createProduct(FeaturedImage: string, Gallery: string[], ShopId: string, Group: string, Categories: string[], Authors: string[], Manufacturers: string[], Tags: string[], Name: string, Description: string, Unit: string, Status: string, ProductType: string, SimpleProduct: any, VariableProduct: any) {
    try {
      const product = new ProductsModel({
        State: "Pending",
        FeaturedImage,
        Gallery,
        ShopId,
        Group,
        Categories,
        Authors,
        Manufacturers,
        Tags,
        Name,
        Description,
        Unit,
        Status,
        ProductType,
        SimpleProduct,
        VariableProduct,
      });
      await product.save();
      return product;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async editProduct(ProductId: string, State: string, Message: string, FeaturedImage: string, Gallery: string[], ShopId: string, Group: string, Categories: string[], Authors: string[], Manufacturers: string[], Tags: string[], Name: string, Description: string, Unit: string, Status: string, ProductType: string, SimpleProduct: SimpleProductType, VariableProduct: VariableProductVarientType[]) {
    try {
      const Product = await ProductsModel.findById(ProductId);
      if (!Product) {
        throw new BadRequestError("invalid Product Id");
      }
      State && (Product.State = State);
      Message && (Product.Message = Message);
      Message && (Product.MessageLog += (Product.MessageLog ? "\n" : "") + `-${new Date().toUTCString()}-: ${Product.State} => ${Message}`);
      FeaturedImage && (Product.FeaturedImage = FeaturedImage);
      Gallery && (Product.Gallery = Gallery);
      ShopId && (Product.ShopId = new mongoose.Types.ObjectId(ShopId));
      Group && (Product.Group = new mongoose.Types.ObjectId(Group));
      Categories && (Product.Categories = Categories.map((v) => new mongoose.Types.ObjectId(v)));
      Authors && (Product.Authors = Authors.map((v) => new mongoose.Types.ObjectId(v)));
      Manufacturers && (Product.Manufacturers = Manufacturers.map((v) => new mongoose.Types.ObjectId(v)));
      Tags && (Product.Tags = Tags.map((v) => new mongoose.Types.ObjectId(v)));
      Name && (Product.Name = Name);
      Description && (Product.Description = Description);
      Unit && (Product.Unit = Unit);
      Status && (Product.Status = Status);

      if (ProductType === "Simple" && SimpleProduct) {
        if (Product.SimpleProduct) {
          SimpleProduct?.DigitalProductFile && (Product.SimpleProduct.DigitalProductFile = SimpleProduct.DigitalProductFile);
          SimpleProduct?.DigitalProductFile && (Product.SimpleProduct.DigitalProductFile = SimpleProduct.DigitalProductFile);
          SimpleProduct?.ExternalProduct && (Product.SimpleProduct.ExternalProduct = SimpleProduct.ExternalProduct);
          SimpleProduct?.Height !== undefined && (Product.SimpleProduct.Height = SimpleProduct.Height);
          SimpleProduct?.IsDigital !== undefined && (Product.SimpleProduct.IsDigital = SimpleProduct.IsDigital);
          SimpleProduct?.IsExternal !== undefined && (Product.SimpleProduct.IsExternal = SimpleProduct.IsExternal);
          SimpleProduct?.Length !== undefined && (Product.SimpleProduct.Length = SimpleProduct.Length);
          SimpleProduct?.Price !== undefined && (Product.SimpleProduct.Price = SimpleProduct.Price);
          SimpleProduct?.Quantity !== undefined && (Product.SimpleProduct.Quantity = SimpleProduct.Quantity);
          SimpleProduct?.SKU !== undefined && (Product.SimpleProduct.SKU = SimpleProduct.SKU);
          SimpleProduct?.SalePrice !== undefined && (Product.SimpleProduct.SalePrice = SimpleProduct.SalePrice);
          SimpleProduct?.Width !== undefined && (Product.SimpleProduct.Width = SimpleProduct.Width);
          if (SimpleProduct?.IsExternal !== undefined) {
            Product.SimpleProduct.IsExternal = SimpleProduct.IsExternal;
            if (SimpleProduct?.IsExternal) {
              SimpleProduct?.ExternalProduct && (Product.SimpleProduct.ExternalProduct = SimpleProduct.ExternalProduct);
            } else {
              Product.SimpleProduct.ExternalProduct = undefined;
            }
          }
          if (SimpleProduct?.IsDigital !== undefined) {
            Product.SimpleProduct.IsDigital = SimpleProduct.IsDigital;
            if (SimpleProduct?.IsDigital) {
              SimpleProduct.DigitalProductFile && (Product.SimpleProduct.DigitalProductFile = SimpleProduct.DigitalProductFile);
            } else {
              Product.SimpleProduct.DigitalProductFile = undefined;
            }
          }
        } else {
          const tmp: any = {};

          SimpleProduct?.Height !== undefined && (tmp.Height = SimpleProduct.Height);
          SimpleProduct?.IsDigital !== undefined && (tmp.IsDigital = SimpleProduct.IsDigital);
          SimpleProduct?.Length !== undefined && (tmp.Length = SimpleProduct.Length);
          SimpleProduct?.Price !== undefined && (tmp.Price = SimpleProduct.Price);
          SimpleProduct?.Quantity !== undefined && (tmp.Quantity = SimpleProduct.Quantity);
          SimpleProduct?.SKU !== undefined && (tmp.SKU = SimpleProduct.SKU);
          SimpleProduct?.SalePrice !== undefined && (tmp.SalePrice = SimpleProduct.SalePrice);
          SimpleProduct?.Width !== undefined && (tmp.Width = SimpleProduct.Width);
          if (SimpleProduct?.IsExternal !== undefined) {
            tmp.IsExternal = SimpleProduct.IsExternal;
            if (SimpleProduct?.IsExternal) {
              SimpleProduct?.ExternalProduct && (tmp.ExternalProduct = SimpleProduct.ExternalProduct);
            }
          }
          if (SimpleProduct?.IsDigital !== undefined) {
            tmp.IsDigital = SimpleProduct.IsDigital;
            if (SimpleProduct?.IsDigital) {
              SimpleProduct?.DigitalProductFile && (tmp.DigitalProductFile = SimpleProduct.DigitalProductFile);
            }
          }
          Product.SimpleProduct = tmp;
          Product.VariableProduct = [];
        }
      } else if (ProductType === "Variable" && VariableProduct) {
        if (Product.ProductType === "Simple") {
          Product.SimpleProduct = undefined;
        }
        const tmp: { [key: string]: VariableProductVarientType } = {};
        VariableProduct.forEach((varient) => {
          const ids = varient.VarientAttributesValues.map((varient) => varient.Value);
          const Key = ids.sort().join("-");
          tmp[Key] = varient;
        });
        Product.VariableProduct.forEach((varient) => {
          const ids = varient.VarientAttributesValues.map((varient) => varient.Value);
          const Key = ids.sort().join("-");
          if (tmp[Key]) {
            tmp[Key]?.Image && (varient.Image = tmp[Key].Image);
            tmp[Key]?.IsDisabled !== undefined && (varient.IsDisabled = tmp[Key].IsDisabled);
            tmp[Key]?.Price !== undefined && (varient.Price = tmp[Key].Price);
            tmp[Key]?.Quantity !== undefined && (varient.Quantity = tmp[Key].Quantity);
            tmp[Key]?.SKU !== undefined && (varient.SKU = tmp[Key].SKU);
            tmp[Key]?.SalePrice !== undefined && (varient.SalePrice = tmp[Key].SalePrice);

            if (tmp[Key]?.IsDigital !== undefined) {
              varient.IsDigital = tmp[Key].IsDigital;
              if (tmp[Key].IsDigital) {
                tmp[Key]?.DigitalProductFile && (varient.DigitalProductFile = tmp[Key].DigitalProductFile);
              } else {
                varient.DigitalProductFile = undefined;
              }
            }
            delete tmp[Key];
          } else {
            Product.VariableProduct = Product.VariableProduct.filter((val) => val._id !== varient._id);
          }
        });
        Product.VariableProduct.push(...Object.values(tmp));
      }
      ProductType && (Product.ProductType = ProductType);
      await Product.save();
      return Product;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  /************ */
  async getproducts(UserId: string, Page: number = 0, Limit: number = 12) {
    try {
      Page = Page < 1 ? 0 : Page - 1;

      const products = await ProductsModel.aggregate([
        {
          $match: {
            State: "Approved",
            Status: "Published",
          },
        },
        { $skip: Page * Limit },
        { $limit: Limit + 1 },
        {
          $lookup: {
            from: "Authors",
            localField: "Authors",
            foreignField: "_id",
            as: "Authors",
          },
        },
        {
          $lookup: {
            from: "Tags",
            localField: "Tags",
            foreignField: "_id",
            as: "Tags",
          },
        },
        {
          $lookup: {
            from: "Categories",
            localField: "Categories",
            foreignField: "_id",
            as: "Categories",
          },
        },
        {
          $lookup: {
            from: "Manufacturers",
            localField: "Manufacturers",
            foreignField: "_id",
            as: "Manufacturers",
          },
        },
        {
          $lookup: {
            from: "WishList",
            localField: "_id",
            foreignField: "ProductId",
            pipeline: [{ $match: { UserId: new mongoose.Types.ObjectId(UserId) } }],
            as: "Wishers",
          },
        },
        {
          $lookup: {
            from: "Shops",
            localField: "ShopId",
            foreignField: "_id",
            as: "Shop",
          },
        },
        {
          $addFields: {
            Wished: {
              $in: [
                new mongoose.Types.ObjectId(UserId),
                {
                  $map: {
                    input: "$Wishers",
                    as: "doc",
                    in: "$$doc.UserId",
                  },
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              { $unwind: "$Icon" },
            ],
            as: "Group",
          },
        },
        { $unwind: "$Group" },
        { $unwind: "$Shop" },
        { $project: { Wishers: 0 } },
      ]);

      // const products = await ProductsModel.find({});
      // return await this.joinAttributes(products);
      const CurPage = products.length < Limit + 1 ? Page : Page + 1;
      const HasNext = products.length < Limit + 1 ? false : true;
      HasNext && products.pop();
      return { Products: products, Page: CurPage, HasNext };
    } catch (e: any) {
      throw new APIError("get products error ", e.message);
    }
  }

  async getSellerProducts(UserId: string) {
    try {
      const shops = await ShopsModel.find({ Owner: new mongoose.Types.ObjectId(UserId) });
      const products = await ProductsModel.aggregate([
        { $match: { ShopId: { $in: shops.map((v) => v._id) } } },
        {
          $lookup: {
            from: "WishList",
            localField: "_id",
            foreignField: "ProductId",
            as: "Wishers",
          },
        },
        {
          $lookup: {
            from: "Shops",
            localField: "ShopId",
            foreignField: "_id",
            as: "Shop",
          },
        },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              { $unwind: "$Icon" },
            ],
            as: "Group",
          },
        },
        { $unwind: "$Group" },
        { $unwind: "$Shop" },
      ]);
      return products;
    } catch (e: any) {
      throw new APIError("get seller products error ", e.message);
    }
  }
  async getAdminProducts() {
    try {
      const products = await ProductsModel.aggregate([
        {
          $lookup: {
            from: "WishList",
            localField: "_id",
            foreignField: "ProductId",
            as: "Wishers",
          },
        },
        {
          $lookup: {
            from: "Shops",
            localField: "ShopId",
            foreignField: "_id",
            as: "Shop",
          },
        },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              { $unwind: "$Icon" },
            ],
            as: "Group",
          },
        },
        { $unwind: "$Group" },
        { $unwind: "$Shop" },
      ]);
      return products;
    } catch (e: any) {
      throw new APIError("get seller products error ", e.message);
    }
  }
  async getproductById(productId: string) {
    try {
      //return await ProductsModel.findById(productId);
      const product = await ProductsModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(productId) } },
        {
          $lookup: {
            from: "Authors",
            localField: "Authors",
            foreignField: "_id",
            as: "Authors",
          },
        },
        {
          $lookup: {
            from: "Tags",
            localField: "Tags",
            foreignField: "_id",
            as: "Tags",
          },
        },
        {
          $lookup: {
            from: "Categories",
            localField: "Categories",
            foreignField: "_id",
            as: "Categories",
          },
        },
        {
          $lookup: {
            from: "Manufacturers",
            localField: "Manufacturers",
            foreignField: "_id",
            as: "Manufacturers",
          },
        },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              { $unwind: "$Icon" },
            ],
            as: "Group",
          },
        },
        { $unwind: "$Group" },
        //{ $match: { _id: new mongoose.Types.ObjectId(productId) } },
      ]);
      return await this.joinAttributes(product);
    } catch (e: any) {
      throw new APIError("get product By Id error ", e.message);
    }
  }
  async getSellerProductById(UserId: string, productId: string) {
    try {
      const shops = await ShopsModel.find({ Owner: new mongoose.Types.ObjectId(UserId) });
      const product = await ProductsModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(productId) } },
        {
          $lookup: {
            from: "Authors",
            localField: "Authors",
            foreignField: "_id",
            as: "Authors",
          },
        },
        {
          $lookup: {
            from: "Tags",
            localField: "Tags",
            foreignField: "_id",
            as: "Tags",
          },
        },
        {
          $lookup: {
            from: "Categories",
            localField: "Categories",
            foreignField: "_id",
            as: "Categories",
          },
        },
        {
          $lookup: {
            from: "Manufacturers",
            localField: "Manufacturers",
            foreignField: "_id",
            as: "Manufacturers",
          },
        },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              { $unwind: "$Icon" },
            ],
            as: "Group",
          },
        },
        { $unwind: "$Group" },
        //{ $match: { _id: new mongoose.Types.ObjectId(productId) } },
      ]);
      if (!shops.map((v) => "" + v._id).includes("" + product[0].ShopId)) {
        throw new UnauthorizedError("access denid you have no access to that product");
      }
      return await this.joinAttributes(product);
    } catch (e: any) {
      throw new APIError("get product By Id error ", e.message);
    }
  }
  async getProductsByIds(Ids: string[]) {
    try {
      // return await ProductsModel.find({ _id: { $in: [...Ids] } });
      const products = await ProductsModel.aggregate([
        { $match: { _id: { $in: Ids.map((id) => new mongoose.Types.ObjectId(id)) } } },
        {
          $lookup: {
            from: "Authors",
            localField: "Authors",
            foreignField: "_id",
            as: "Authors",
          },
        },
        {
          $lookup: {
            from: "Tags",
            localField: "Tags",
            foreignField: "_id",
            as: "Tags",
          },
        },
        {
          $lookup: {
            from: "Categories",
            localField: "Categories",
            foreignField: "_id",
            as: "Categories",
          },
        },
        {
          $lookup: {
            from: "Manufacturers",
            localField: "Manufacturers",
            foreignField: "_id",
            as: "Manufacturers",
          },
        },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              { $unwind: "$Icon" },
            ],
            as: "Group",
          },
        },
        { $unwind: "$Group" },
      ]);
      return await this.joinAttributes(products);
    } catch (e: any) {
      throw new APIError("get product By Ids error ", e.message);
    }
  }
  async getProductByIdAndVariableId(ProductId: string, VariableId: string) {
    try {
      const product = await ProductsModel.findOne({ _id: new mongoose.Types.ObjectId(ProductId), "VariableProduct._id": new mongoose.Types.ObjectId(VariableId) });
      return product;
    } catch (e: any) {
      throw new APIError("get Product By Id And VariableId ", e.message);
    }
  }
  async getShopProductsCountByIds(Ids: string[]) {
    const count = await ProductsModel.aggregate([
      { $match: { ShopId: { $in: Ids.map((id) => new mongoose.Types.ObjectId(id)) } } },
      {
        $group: {
          _id: "$ShopId",
          Count: { $sum: 1 },
        },
      },
    ]);
    return count;
  }
  /************************************************************************ */
  /************************************************************************ */
  /************************************************************************ */
  async createShop(_id: string, Owner: string, Logo: string, CoverImage: string, Name: string, Active: boolean, Description: string, Address: any, PaymentInfo: any, ShopSettings: any) {
    try {
      const shop = new ShopsModel({
        _id,
        Owner,
        Logo,
        CoverImage,
        Name,
        Active,
        Description,
        Address,
        PaymentInfo,
        ShopSettings,
      });
      await shop.save();
      return shop;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateShop(_id: string, Owner: string, Logo: string, CoverImage: string, Name: string, Active: boolean, Description: string, Address: any, PaymentInfo: any, ShopSettings: any) {
    try {
      const shop = await ShopsModel.findById(_id);
      if (!shop) {
        throw new BadRequestError(`shop with id ${_id} not found`);
      }
      shop.Owner = new mongoose.Types.ObjectId(Owner);
      shop.Logo = Logo;
      shop.CoverImage = CoverImage;
      shop.Name = Name;
      shop.Active = Active;
      shop.Description = Description;
      shop.Address = Address;
      shop.PaymentInfo = PaymentInfo;
      shop.ShopSettings = ShopSettings;
      await shop.save();
      return shop;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createAttribute(_id: string, Name: string, ShopId: string, AttributeValues: any[]) {
    try {
      for (let i = 0; i < AttributeValues.length; i++) {
        if (!AttributeValues[i].Value) {
          throw new BadRequestError("invalid Attribute value");
        }
      }
      const attribute = new AttributesModel({
        _id,
        Name,
      });
      await attribute.save();
      const AttributeValueslist: any = [];
      for (let i = 0; i < AttributeValues.length; i++) {
        const attributevalue = new AttributesValuesModel({
          _id: AttributeValues[i]._id,
          Attribute: attribute._id,
          ShopId: ShopId,
          Value: AttributeValues[i].Value,
          Meta: AttributeValues[i]?.Meta,
        });
        await attributevalue.save();
        AttributeValueslist.push(attributevalue);
      }

      return { _id: attribute._id, Name: attribute.Name, AttributeValues: AttributeValueslist };
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateAttribute(AttributeId: string, Name: string, ShopId: string, AttributeValues: any[], DeletedAttributeValuesIds: string[]) {
    try {
      const attribute = await AttributesModel.findById(AttributeId);
      if (!attribute) {
        throw new BadRequestError(`attribute with id ${AttributeId} not found`);
      }

      ShopId && (attribute.ShopId = new mongoose.Types.ObjectId(ShopId));

      Name && (attribute.Name = Name);

      for (let Value of AttributeValues) {
        let value;
        try {
          value = await AttributesValuesModel.findById(Value._id);
          if (!value) {
            throw new BadRequestError(`AttributeValue with id ${Value._id} not found`);
          }
          Value.Meta && (value.Meta = Value.Meta);
          Value.Value && (value.Value = Value.Value);
        } catch (e: any) {
          value = new AttributesValuesModel({
            _id: Value._id,
            Value: Value.Value,
            Attribute: AttributeId,
            Meta: Value.Meta,
          });
        }
        await value.save();
      }
      if (Array.isArray(DeletedAttributeValuesIds) && DeletedAttributeValuesIds.length > 0) {
        const AttributeValues = await AttributesValuesModel.find({ _id: { $in: DeletedAttributeValuesIds.map((v) => new mongoose.Types.ObjectId(v)) }, Attribute: AttributeId });
        for (let val of AttributeValues) {
          val.IsDeleted = true;
          await val.save();
        }
      }

      await attribute.save();
      return attribute;
      // return { _id: attribute._id, Name: attribute.Name, ShopId: attribute.ShopId, AttributeValues: AttributeValuesList, DeletedAttributeValuesIds: DeletedAttributeValuesIdsList };
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createManufacturer(_id: string, Logo: string, CoverImage: string, Name: string, Website: string, Description: string, Group: string, SocialProfiles: string[]) {
    try {
      const Manufacturer = new ManufacturersModel({
        _id,
        Logo,
        CoverImage,
        Name,
        Website,
        Description,
        Group,
        SocialProfiles,
      });
      await Manufacturer.save();
      return Manufacturer;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateManufacturer(_id: string, Logo: string, CoverImage: string, Name: string, Website: string, Description: string, Group: string, SocialProfiles: any[]) {
    try {
      const Manufacturer = await ManufacturersModel.findById(_id);
      if (!Manufacturer) {
        throw new BadRequestError(`manufacturer with id ${_id} not found`);
      }
      Logo && (Manufacturer.Logo = Logo);
      CoverImage && (Manufacturer.CoverImage = CoverImage);
      Name && (Manufacturer.Name = Name);
      Website && (Manufacturer.Website = Website);
      Description && (Manufacturer.Description = Description);
      Group && (Manufacturer.Group = new mongoose.Types.ObjectId(Group));
      SocialProfiles && (Manufacturer.SocialProfiles = SocialProfiles);
      await Manufacturer.save();
      return Manufacturer;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createAuthor(_id: string, Image: string, Name: string, Languages: string, Bio: string, Quote: string, Born: string, Death: string, SocialProfiles: any[]) {
    try {
      const author = new AuthorsModel({
        _id,
        Image,
        Name,
        Languages,
        Bio,
        Quote,
        Born,
        Death,
        SocialProfiles,
      });
      await author.save();
      return author;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateAuthor(_id: string, Image: string, Name: string, Languages: string, Bio: string, Quote: string, Born: string, Death: string, SocialProfiles: any[]) {
    try {
      const author = await AuthorsModel.findById(_id);
      if (!author) {
        throw new BadRequestError(`author with id ${_id} not found`);
      }
      Image && (author.Image = Image);
      Name && (author.Name = Name);
      Languages && (author.Languages = Languages);
      Bio && (author.Bio = Bio);
      Quote && (author.Quote = Quote);
      Born && (author.Born = Born);
      Death && (author.Death = Death);
      Array.isArray(SocialProfiles) && (author.SocialProfiles = SocialProfiles);
      await author.save();
      return author;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  /************ */

  async getAttributesByIds(ids: any[]) {
    const attributes = await AttributesModel.find({ _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) } });
    return ArrToObj(attributes, "_id");
  }
  async getAttributesValuesByIds(ids: any[]) {
    const attributes = await AttributesValuesModel.find({ _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }, IsDeleted: false });
    return ArrToObj(attributes, "_id");
  }
  async joinAttributes(products: ProductsType[]) {
    const attributesIds: any[] = [];
    const valuesIds: any[] = [];
    products.forEach((product) => {
      product.VariableProduct.forEach((vp) => {
        vp.VarientAttributesValues.forEach((val) => {
          attributesIds.push(val.Attribute);
          valuesIds.push(val.Value);
        });
      });
    });
    const [attribute, values] = await Promise.all([this.getAttributesByIds(attributesIds), this.getAttributesValuesByIds(valuesIds)]);
    products.forEach((product) => {
      product.VariableProduct.forEach((vp) => {
        vp.VarientAttributesValues.forEach((val) => {
          val.Attribute = attribute["" + val.Attribute];
          val.Value = values["" + val.Value];
        });
      });
    });
    return products;
  }
  async getManufacturersByIds(Ids: string[]) {
    try {
      const manufacturers = await ManufacturersModel.find({ _id: { $in: Ids } });
      return manufacturers;
    } catch (e: any) {
      throw new APIError("get Manufacturers By Ids error", e.message);
    }
  }
  async getAuthorsByIds(Ids: string[]) {
    try {
      const authors = await AuthorsModel.find({ _id: { $in: Ids } });
      return authors;
    } catch (e: any) {
      throw new APIError("get Authors By Ids error", e.message);
    }
  }
  async getShopsByIds(Ids: string[]) {
    try {
      const authors = await ShopsModel.find({ _id: { $in: Ids } });
      return authors;
    } catch (e: any) {
      throw new APIError("get Authors By Ids error", e.message);
    }
  }
  async getOwnerShopsByIds(Owner: string, Ids: string[]) {
    try {
      const shops = await ShopsModel.find({ Owner: Owner, _id: { $in: Ids } });
      return shops;
    } catch (e: any) {
      throw new APIError("get Authors By Ids error", e.message);
    }
  }

  /************************************************************************ */
  /************************************************************************ */
  /************************************************************************ */

  async createGroup(_id: string, Name: string, Icon: string, Layout: string, ProductCard: string, PromotionalSliders: any, Banners: any) {
    try {
      const group = new GroupsModel({
        _id,
        Name,
        Icon,
        Layout,
        ProductCard,
        PromotionalSliders,
        Banners,
      });
      await group.save();
      return group;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async setMainGroup(id: string) {
    let maingroup = await MainGroupModel.findOne({ Key: "MainGroup" });
    if (!maingroup) {
      maingroup = new MainGroupModel({
        Key: "MainGroup",
        GroupId: new mongoose.Types.ObjectId(id),
      });
    } else {
      maingroup.GroupId = new mongoose.Types.ObjectId(id);
    }
    await maingroup.save();
    return maingroup;
  }
  async createCategory(_id: string, Name: string, Details: string, Icon: string, Group: string, SubCategories: SubCategoriesType) {
    try {
      let category = await CategoriesModel.findById(_id);
      if (!category) {
        category = new CategoriesModel({
          _id,
          Name,
          Details,
          Icon,
          Group,
          SubCategories,
        });
      } else {
        Name && (category.Name = Name);
        Details && (category.Details = Details);
        Icon && (category.Icon = new mongoose.Types.ObjectId(Icon));
        Group && (category.Group = new mongoose.Types.ObjectId(Group));
        Array.isArray(SubCategories) && (category.SubCategories = SubCategories);
      }
      await category.save();
      return category;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateSocialMediaPlatform(id: string, Name: string, Icon: string) {
    try {
      const socialmediaplatform = await SocialMediaPlatformsModel.findById(id);
      if (!socialmediaplatform) {
        throw new BadRequestError(`social media platform with id ${id} not found`);
      }
      Name && (socialmediaplatform.Name = Name);
      Icon && (socialmediaplatform.Icon = Icon);
      await socialmediaplatform.save();
      return socialmediaplatform;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async updateCategoryById(_id: string, Name: string, Details: string, Icon: string, Group: string, SubCategories: any[]) {
    try {
      const category = await CategoriesModel.findById(_id);
      if (!category) {
        throw new BadRequestError(`category with id ${_id} not found`);
      }
      Name && (category.Name = Name);
      Details && (category.Details = Details);
      Icon && (category.Icon = new mongoose.Types.ObjectId(Icon));
      Group && (category.Group = new mongoose.Types.ObjectId(Group));
      Array.isArray(SubCategories) && (category.SubCategories = SubCategories);
      await category.save();
      return category;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createIcon(_id: string, Name: string, Url: string) {
    try {
      const icon = new IconsModel({
        _id,
        Name,
        Url,
      });
      await icon.save();
      return icon;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateIconById(_id: string, Name: string, Url: string) {
    try {
      const icon = await IconsModel.findById(_id);
      if (!icon) {
        throw new BadRequestError(`icon with id ${_id} not found`);
      }
      Name && (icon.Name = Name);
      Url && (icon.Url = Url);
      await icon.save();
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createTag(_id: string, Name: string, Details: string, Icon: string, Group: string) {
    try {
      const tag = new TagsModel({
        _id,
        Name,
        Details,
        Icon,
        Group,
      });
      await tag.save();
      return tag;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateTagById(_id: string, Name: string, Details: string, Icon: string, Group: string) {
    try {
      const tag = await TagsModel.findById(_id);
      if (!tag) {
        throw new BadRequestError(`tag with id ${_id} not found`);
      }
      Name && (tag.Name = Name);
      Details && (tag.Details = Details);
      Icon && (tag.Icon = new mongoose.Types.ObjectId(Icon));
      Group && (tag.Group = new mongoose.Types.ObjectId(Group));
      await tag.save();
      return tag;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async createSocialMediaPlatform(_id: string, Icon: string, Name: string) {
    try {
      const socialmediaplatform = new SocialMediaPlatformsModel({ _id, Icon, Name });
      await socialmediaplatform.save();
      return socialmediaplatform;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  /************ */

  async getCategoriesByIds(Ids: string[]) {
    try {
      const categories = await CategoriesModel.find({ _id: { $in: Ids } });
      return categories;
    } catch (e: any) {
      throw new APIError("get Categories By Ids error ", e.message);
    }
  }
  async getGroupsByIds(Ids: string[]) {
    try {
      const groups = await GroupsModel.find({ _id: { $in: Ids } });
      return groups;
    } catch (e: any) {
      throw new APIError("get Groups By Ids error ", e.message);
    }
  }
  async getTagsByIds(Ids: string[]) {
    try {
      const tags = await TagsModel.find({ _id: { $in: Ids } });
      return tags;
    } catch (e: any) {
      throw new APIError("get Tags By Ids error ", e.message);
    }
  }
  async getSocialMediaPlatformsByIds(Ids: string[]) {
    try {
      const socioalmediaplatform = await SocialMediaPlatformsModel.find({ _id: { $in: Ids } });
      return socioalmediaplatform;
    } catch (e: any) {
      throw new APIError("GetSocialMediaPlatformById error ", e.message);
    }
  }
  /************************************************************************ */
  /************************************************************************ */
  /************************************************************************ */

  async CreateFile(_id: string, Path: string, OriginalName: string, Mimetype: string, AccessType: string, AccessUsers: string[]) {
    try {
      const file = new FilesModel({
        _id,
        Path,
        OriginalName,
        Mimetype,
        AccessType,
        AccessUsers,
      });
      await file.save();
      return file;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async GetFilesByIds(Ids: string[]) {
    try {
      const files = await FilesModel.find({ _id: { $in: Ids } });
      return files;
    } catch (e: any) {
      throw new APIError("get file error", e.message);
    }
  }
  /************************************************************************ */
  /************************************************************************ */
  /************************************************************************ */

  async createWish(_id: string, UserId: string, ProductId: string) {
    try {
      const wish = new WishListModel({
        _id,
        UserId,
        ProductId,
      });
      await wish.save();
      return;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async removeWish(UserId: string, ProductId: String) {
    try {
      const wish = await WishListModel.deleteOne({ UserId, ProductId });
      return wish;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async getWishList(UserId: string) {
    try {
      const wishlist = await WishListModel.aggregate([
        {
          $match: { UserId: new mongoose.Types.ObjectId(UserId) },
        },
        {
          $lookup: {
            from: "Products",
            localField: "ProductId",
            foreignField: "_id",
            as: "Product",
          },
        },
        { $unwind: "$Product" },
      ]);
      return wishlist;
    } catch (e: any) {
      throw new APIError("get wishList error", e.message);
    }
  }

  /************************************************************************ */
  /************************************************************************ */
  /************************************************************************ */

  // async shopProductsCount(shopId){

  // }
}
