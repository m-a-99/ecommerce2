import mongoose from "mongoose";
import { APIError, BadRequestError } from "../../utils/app-errors";
import { UsersModel } from "../models";

export class UserRepository {
  async createUser(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string) {
    try {
      const user = new UsersModel({
        FirstName,
        LastName,
        Email,
        AccountType,
        Password,
      });
      await user.save();
      const res = { ...user.toObject(), Password: undefined };
      delete res["Password"];
      return res;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await UsersModel.findById(id).select("-Password -__v");
      return user;
    } catch (e: any) {
      throw new APIError("get User By Id error", e.message);
    }
  }

  async getUsersByIds(Ids: string[]) {
    try {
      const users = await UsersModel.find({ _id: { $in: Ids } }).select("-Password -__v");
      return users;
    } catch (e: any) {
      throw new APIError("get User By Id error", e.message);
    }
  }

  async getUserByEmail(Email: string) {
    try {
      const user = await UsersModel.findOne({ Email });
      return user;
    } catch (e: any) {
      throw new APIError("get User By Email error", e.message);
    }
  }

  async getProfile(id: string) {
    try {
      const profile = await UsersModel.findById(id, { createdAt: false, updatedAt: false, __v: false, password: false });
      return profile;
    } catch (e: any) {
      throw new APIError("get profile error", e.message);
    }
  }

  async AddContact(UserId: string, Title: string, Value: string) {
    try {
      const user = await UsersModel.findById(UserId).select("-Password -__v");
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      user.Contacts.push({ Title, Value });
      await user.save();
      return user;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async DeleteContact(UserId: string, ContactId: string) {
    try {
      const user = await UsersModel.findOne({ _id: UserId, "Contacts._id": ContactId });
      if (!user) {
        throw new BadRequestError(`User With Id:-${UserId}  And Contact Id:-${ContactId} Not Found`);
      }
      user.Contacts.pull({ _id: ContactId });
      await user.save();
      return user;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async setAddress(UserId: string, AddressType: string, Title: string, Country: string, City: string, State: string, Zip: string, StreetAddress: string) {
    try {
      const user = await UsersModel.findById(UserId).select("-Password -__v");
      if (AddressType !== "Shipping" && AddressType !== "Billing") {
        throw new BadRequestError(`${AddressType} Invalid AddressType`);
      }
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      AddressType === "Billing" ? (user.BillingAddress = { Title, Country, City, State, Zip, StreetAddress }) : (user.ShippingAddress = { Title, Country, City, State, Zip, StreetAddress });
      await user.save();
      return user;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async DeleteAddress(UserId: string, AddressType: string) {
    try {
      const user = await UsersModel.findById(UserId).select("-Password -__v");
      if (AddressType !== "Shipping" && AddressType !== "Billing") {
        throw new BadRequestError(`${AddressType} Invalid AddressType`);
      }
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      AddressType === "Billing" ? (user.BillingAddress = undefined) : (user.ShippingAddress = undefined);
      await user.save();
      return user;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateStatus(UserId: string, Status: string, Message: string) {
    try{
      const user = await UsersModel.findById(UserId).select({ Password: false });
      if (!user) {
        throw new BadRequestError(`user with  id ${UserId}  not found`);
      }
      Status && (user.Status = Status);
      Message && (user.Message = Message);
      Message && (user.MessageLog += (user.MessageLog ? "\n" : "") + `-${new Date().toUTCString()}-: ${user.Status} => ${Message}`);
      await user.save();
      return user;
    }catch(e:any){
      throw new BadRequestError(e.message)
    }
  }

  async GetUserById(UserId: string) {
    try {
      const user = await UsersModel.findById(UserId);
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      return user;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async ChangePassword(UserId: string, NewPassword: string) {
    try {
      const user = await UsersModel.findById(UserId).select("");
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      user.Password = NewPassword;
      await user.save();
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async UpdateProfile(UserId: string, FirstName: string, LastName: string, Email: string, Img: string, Bio: string) {
    try {
      const User = await UsersModel.findById(UserId).select("-Password");
      if (!User) {
        throw new BadRequestError(`User With ${UserId} Not Founded`);
      }
      FirstName && (User.FirstName = FirstName);
      LastName && (User.LastName = LastName);
      Email && (User.Email = Email);
      Img && (User.Img = Img);
      Bio && (User.Bio = Bio);
      await User.save();
      return User;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getUsers(Role: string, Page: number, Limit: number) {
    try {
      if (!["SubAdmin", "Client", "Seller", "SubSeller"].includes(Role)) {
        Role = "Client";
      }
      return {
        ...(await this.Pageination2(
          async () => {
            const filter = { AccountType: Role };
            const count = await UsersModel.countDocuments(filter);
            const query = UsersModel.find(filter).select({ Password: false });
            return { count, query };
          },
          Page,
          Limit,
          (collection) => collection
        )),
        Role,
      };
    } catch (e: any) {
      throw new APIError(e.message);
    }
  }

  private async Pageination2(cb1: () => Promise<{ count: number; query: mongoose.Query<any[], any, {}, any> | mongoose.Aggregate<any[]> }>, Page: number = 1, Limit: number = 12, cb2: (d: mongoose.Query<any[], any, {}, any> | mongoose.Aggregate<any[]>) => any) {
    Page = Page < 1 ? 0 : Page - 1;
    const { count, query } = await cb1();
    let result;
    if (Page * Limit + Limit <= count) {
      const data = query.skip(Page * Limit).limit(Limit);
      result = await cb2(data);
    } else {
      const data = query.skip(Math.trunc(count / Limit) * Limit);
      result = await cb2(data);
    }
    let CurPage = Page * Limit + Limit < count ? Page + 1 : Math.ceil(count / Limit);
    CurPage = CurPage === 0 ? 1 : CurPage;
    const HasNext = Page * Limit + Limit < count;
    return { Data: result, Page: CurPage, HasNext, Count: count, Pages: Math.ceil(count / Limit) };
  }

  
}
