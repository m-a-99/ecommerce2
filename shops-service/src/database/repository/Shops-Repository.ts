import mongoose, { Schema } from "mongoose";
import { APIError, BadRequestError, UnauthorizedError } from "../../utils/app-errors";
import { AttributesModel, AttributesValuesModel, AuthorsModel, ManufacturersModel, ShopsModel } from "../models";
import { v4 } from "uuid";
export class ShopsRepository {
  async getShops() {
    try {
      const shops = await ShopsModel.find({}).lean();
      return shops;
    } catch (e: any) {
      throw new APIError("get shops error", e.message);
    }
  }
  async getShopById(Id: string) {
    try {
      const shop = await ShopsModel.findById(Id).lean();
      return shop;
    } catch (e: any) {
      throw new APIError("get shop by id error", e.message);
    }
  }
  async getSellerShops(SellerId: string) {
    try {
      const shops = await ShopsModel.find({ Owner: new mongoose.Types.ObjectId(SellerId) }).lean();
      return shops;
    } catch (e: any) {
      throw new APIError("get Seller Shops error", e.message);
    }
  }

  async UpdateShopById(Owner: any, ShopId: string, Logo: string, CoverImage: string, Name: string, Description: string, Active: boolean, City: string, Country: string, State: string, StreetAddress: string, Zip: string, AccountHolderEmail: string, AccountHolderName: string, AccountNumber: string, BankName: string, ContactNumber: string, Website: string, Latitude: number, Longtude: number) {
    try {
      const shop = Owner.AccountType === "Admin" ? await ShopsModel.findOne({ ShopId }) : await ShopsModel.findOne({ Owner: Owner._id, ShopId });
      if (!shop) {
        throw new BadRequestError(`shop with id ${ShopId} not found for Owner ${Owner}`);
      }

      Logo && (shop.Logo = Logo);
      CoverImage && (shop.CoverImage = CoverImage);
      Name && (shop.Name = Name);
      Description && (shop.Description = Description);
      Active !== undefined && (shop.Active = Active);
      if (shop.Address) {
        City && (shop.Address.City = City);
        Country && (shop.Address.Country = Country);
        State && (shop.Address.State = State);
        StreetAddress && (shop.Address.StreetAddress = StreetAddress);
        Zip && (shop.Address.Zip = Zip);
      } else {
        if (City || Country || State || StreetAddress || Zip) {
          shop.Address = { City, Country, State, StreetAddress, Zip };
        }
      }
      if (shop.PaymentInfo) {
        AccountHolderEmail && (shop.PaymentInfo.AccountHolderEmail = AccountHolderEmail);
        AccountHolderName && (shop.PaymentInfo.AccountHolderName = AccountHolderName);
        AccountNumber && (shop.PaymentInfo.AccountNumber = AccountNumber);
        BankName && (shop.PaymentInfo.BankName = BankName);
      } else {
        shop.PaymentInfo = { AccountHolderEmail, AccountHolderName, AccountNumber, BankName };
      }
      if (shop.ShopSettings) {
        ContactNumber && (shop.ShopSettings.ContactNumber = ContactNumber);
        Website && (shop.ShopSettings.Website = Website);
        if (shop.ShopSettings.Location) {
          Latitude !== undefined && (shop.ShopSettings.Location.Latitude = Latitude);
          Longtude !== undefined && (shop.ShopSettings.Location.Longtude = Longtude);
        } else {
          if (Latitude !== undefined || Longtude !== undefined) {
            shop.ShopSettings.Location = { Latitude, Longtude };
          }
        }
      } else {
        shop.ShopSettings = { ContactNumber, Website, Location: Latitude !== undefined || Longtude !== undefined ? { Longtude, Latitude } : undefined };
      }

      await shop.save();
      return shop;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createShop(Owner: string, Logo: string, CoverImage: string, Name: string, Description: string, Active: boolean, City: string, Country: string, State: string, StreetAddress: string, Zip: string, AccountHolderEmail: string, AccountHolderName: string, AccountNumber: string, BankName: string, ContactNumber: string, Website: string, Latitude: number, Longtude: number) {
    try {
      let Address: any = undefined;
      let PaymentInfo: any = undefined;
      let ShopSettings: any = undefined;
      let Location: any = undefined;

      if (City || Country || State || StreetAddress || Zip) {
        Address = {
          City,
          Country,
          State,
          StreetAddress,
          Zip,
        };
      }

      if (AccountHolderEmail || AccountHolderName || AccountNumber || BankName) {
        PaymentInfo = {
          AccountHolderEmail,
          AccountHolderName,
          AccountNumber,
          BankName,
        };
      }
      if (Latitude || Longtude) {
        Location = {
          Latitude,
          Longtude,
        };
      }
      if (ContactNumber || Website || Location) {
        ShopSettings = { ContactNumber, Website, Location };
      }

      const shop = new ShopsModel({
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

  async getAttributes() {
    try {
      const attributes = await AttributesModel.aggregate([
        {
          $lookup: {
            from: "AttributesValues",
            localField: "_id",
            foreignField: "Attribute",
            pipeline: [{ $match: { IsDeleted: false } }],
            as: "AttributeValues",
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
        { $unwind: "$Shop" },
      ]);
      return attributes;
    } catch (e: any) {
      throw new APIError("get Attributes error", e.message);
    }
  }

  async getAttributeById(attributeId: string) {
    try {
      const attribute = await AttributesModel.aggregate([
        { $match: { _id: { $in: [new mongoose.Types.ObjectId(attributeId)] } } },
        {
          $lookup: {
            from: "AttributesValues",
            localField: "_id",
            foreignField: "Attribute",
            pipeline: [{ $match: { IsDeleted: false } }],
            as: "AttributeValues",
          },
        },
      ]);
      return attribute[0];
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createAttribute(ShopId: string, Name: string, AttributeValues: any[]) {
    try {
      for (let i = 0; i < AttributeValues.length; i++) {
        if (!AttributeValues[i].Value) {
          throw new BadRequestError("invalid Attribute value");
        }
      }
      const attribute = new AttributesModel({
        ShopId,
        Name,
      });
      await attribute.save();
      const AttributeValueslist: any = [];
      for (let i = 0; i < AttributeValues.length; i++) {
        const attributevalue = new AttributesValuesModel({
          Attribute: attribute._id,
          Value: AttributeValues[i].Value,
          Meta: AttributeValues[i]?.Meta,
        });
        await attributevalue.save();
        AttributeValueslist.push(attributevalue);
      }
      return { _id: attribute._id, Name: attribute.Name, ShopId: attribute.ShopId, AttributeValues: AttributeValueslist };
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async editAttribute(Owner: any, AttributeId: string, ShopId: string, Name: string, AttributeValues: any[], DeletedAttributeValuesIds: string[]) {
    try {
      const attribute = await AttributesModel.findById(AttributeId);
      if (!attribute) {
        throw new BadRequestError(`attribute with id ${AttributeId} not found`);
      }
      if (Owner.AccountType === "Seller") {
        const shop = await ShopsModel.findById(attribute.ShopId);
        if ("" + shop?.Owner !== "" + Owner._id) {
          throw new UnauthorizedError("unauthorized operation edit shop attribute denied");
        }
        ShopId && (attribute.ShopId = new mongoose.Types.ObjectId(ShopId));
      }
      Name && (attribute.Name = Name);
      const AttributeValuesList: any = [];
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
            Value: Value.Value,
            Attribute: AttributeId,
            Meta: Value.Meta,
          });
        }
        AttributeValuesList.push(value);
        await value.save();
      }
      const DeletedAttributeValuesIdsList: string[] = [];
      if (Array.isArray(DeletedAttributeValuesIds) && DeletedAttributeValuesIds.length > 0) {
        const AttributeValues = await AttributesValuesModel.find({ _id: { $in: DeletedAttributeValuesIds.map((v) => new mongoose.Types.ObjectId(v)) }, Attribute: AttributeId });
        for (let val of AttributeValues) {
          val.IsDeleted = true;
          await val.save();
          DeletedAttributeValuesIdsList.push("" + val._id);
        }
      }

      await attribute.save();
      return { _id: attribute._id, Name: attribute.Name, ShopId: attribute.ShopId, AttributeValues: AttributeValuesList, DeletedAttributeValuesIds: DeletedAttributeValuesIdsList };
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async getManufacturers() {
    try {
      const manufacturers = await ManufacturersModel.find();
      return manufacturers;
    } catch (e: any) {
      throw new APIError("get manufacturers error", e.message);
    }
  }

  async createManufacturer(Logo: string, CoverImage: string, ShopId: string, Name: string, Website: string, Description: string, Group: string, SocialProfiles: any[]) {
    try {
      const Manufacturer = new ManufacturersModel({
        Logo,
        CoverImage,
        ShopId,
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

  async updateManufacturer(Owner: any, _id: string, Logo: string, CoverImage: string, ShopId: string | undefined, Name: string, Website: string, Description: string, Group: string, SocialProfiles: any[], DeletedSocialProfilesIds: string[]) {
    try {
      const Manufacturer = await ManufacturersModel.findById(_id);
      if (!Manufacturer) {
        throw new BadRequestError(`manufacturer with id ${_id} not found`);
      }
      Logo && (Manufacturer.Logo = Logo);
      CoverImage && (Manufacturer.CoverImage = CoverImage);
      Owner.AccountType === "Seller" && ShopId && (Manufacturer.ShopId = new mongoose.Types.ObjectId(ShopId));
      Name && (Manufacturer.Name = Name);
      Website && (Manufacturer.Website = Website);
      Description && (Manufacturer.Description = Description);
      Group && (Manufacturer.Group = new mongoose.Types.ObjectId(Group));
      if (Array.isArray(SocialProfiles)) {
        const tmp: any = {};
        SocialProfiles.forEach((profile) => {
          profile?._id ? (tmp[profile._id] = profile) : (tmp[v4()] = profile);
        });
        Manufacturer.SocialProfiles.forEach((profile) => {
          if (tmp["" + profile._id]) {
            profile.SocialMediaPlatform = tmp["" + profile._id].SocialMediaPlatform;
            profile.Url = tmp["" + profile._id].Url;
            delete tmp["" + profile._id];
          }
        });
        Object.values(tmp).forEach((profile: any) => {
          console.log(profile);
          Manufacturer.SocialProfiles.push({ SocialMediaPlatform: profile.SocialMediaPlatform, Url: profile.Url });
        });
      }
      if (Array.isArray(DeletedSocialProfilesIds)) {
        DeletedSocialProfilesIds.forEach((id) => {
          Manufacturer.SocialProfiles.pull({ _id: new mongoose.Types.ObjectId(id) });
        });
      }
      await Manufacturer.save();

      return Manufacturer;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getAuthors() {
    try {
      const Authors = await AuthorsModel.find({});
      return Authors;
    } catch (e: any) {
      throw new APIError("get Authors error", e.message);
    }
  }

  async createAuthor(Image: string, Name: string, Languages: string, Bio: string, Quote: string, Born: string, Death: string, SocialProfiles: string[]) {
    console.log(Born,Death)
    try {
      const author = new AuthorsModel({
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

  async updateAuthor(Owner:any,_id: string, Image: string, Name: string,  Languages: string, Bio: string, Quote: string, Born: string, Death: string, SocialProfiles: any[], DeletedSocialProfilesIds: string[]) {
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

      if (Array.isArray(SocialProfiles)) {
        const tmp: any = {};
        SocialProfiles.forEach((profile) => {
          profile?._id ? (tmp[profile._id] = profile) : (tmp[v4()] = profile);
        });
        author.SocialProfiles.forEach((profile) => {
          if (tmp["" + profile._id]) {
            profile.SocialMediaPlatform = tmp["" + profile._id].SocialMediaPlatform;
            profile.Url = tmp["" + profile._id].Url;
            delete tmp["" + profile._id];
          }
        });
        Object.values(tmp).forEach((profile: any) => {
          console.log(profile);
          author.SocialProfiles.push({ SocialMediaPlatform: profile.SocialMediaPlatform, Url: profile.Url });
        });
      }
      if (Array.isArray(DeletedSocialProfilesIds)) {
        DeletedSocialProfilesIds.forEach((id) => {
          author.SocialProfiles.pull({ _id: new mongoose.Types.ObjectId(id) });
        });
      }
      await author.save();
      return author;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getAttributesByIds(Ids: string[]) {
    try {
      const attributes = await AttributesModel.aggregate([
        {
          $lookup: {
            from: "AttributesValues",
            localField: "_id",
            foreignField: "Attribute",
            pipeline: [{ $match: { IsDeleted: false } }],
            as: "AttributeValues",
          },
        },
        {
          $match: {
            _id: { $in: Ids.map((v) => new mongoose.Types.ObjectId(v)) },
          },
        },
      ]);
      return attributes;
    } catch (e: any) {
      throw new APIError("get Attributes By Ids error", e.message);
    }
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
  async getOwnerShopsByIds(Owner: string, Ids: string[]) {
    try {
      const shops = await ShopsModel.find({ Owner: Owner, _id: { $in: Ids } });
      return shops;
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
}
