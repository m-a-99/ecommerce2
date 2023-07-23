import { APIError, BadRequestError } from "../../utils/app-errors";
import { UsersModel } from "../models";

export class UserRepository {
  async createUser(FirstName:string, LastName:string, Email:string, AccountType:string, Password:string) {
    try {
      const user = new UsersModel({
        FirstName,
        LastName,
        Email,
        AccountType,
        Password,
      });
      return await user.save();
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }

  async getUserById(id:string) {
    try {
      const user = await UsersModel.findById(id).select("-Password -__v");
      return user;
    } catch (e:any) {
      throw new APIError("get User By Id error", e.message);
    }
  }

  async getUsersByIds(Ids:string[]){
    try {
      const users = await UsersModel.find({_id:{$in:Ids}}).select("-Password -__v");
      return users;
    } catch (e: any) {
      throw new APIError("get User By Id error", e.message);
    }
  }
  async getUserByEmail(Email:string) {
    try {
      const user = await UsersModel.findOne({ Email });
      return user;
    } catch (e:any) {
      throw new APIError("get User By Email error", e.message);
    }
  }
  async getProfile(id:string) {
    try {
      const profile = await UsersModel.findById(id, { createdAt: false, updatedAt: false, __v: false, password: false });
      return profile;
    } catch (e:any) {
      throw new APIError("get profile error", e.message);
    }
  }

  async AddContact(UserId:string, Title:string, Value:string) {
    try {
      const user = await UsersModel.findById(UserId).select("-Password -__v");
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      user.Contacts.push({ Title, Value });
      await user.save();
      return user;
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }

  async DeleteContact(UserId:string, ContactId:string) {
    try {
      const user = await UsersModel.findOne({ _id: UserId, "Contacts._id": ContactId });
      if (!user) {
        throw new BadRequestError(`User With Id:-${UserId}  And Contact Id:-${ContactId} Not Found`);
      }
      user.Contacts.pull({ _id: ContactId });
      await user.save();
      return user;
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }
  async setAddress(UserId:string, AddressType:string, Title:string, Country:string, City:string, State:string, Zip:string, StreetAddress:string) {
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
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }
  async DeleteAddress(UserId:string, AddressType:string) {
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
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }

  async GetUserById(UserId:string) {
    try {
      const user = await UsersModel.findById(UserId);
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      return user;
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }

  async ChangePassword(UserId:string, NewPassword:string) {
    try {
      const user = await UsersModel.findById(UserId).select("");
      if (!user) {
        throw new BadRequestError(`User With ${UserId} Not Found`);
      }
      user.Password = NewPassword;
      await user.save();
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }

  async UpdateProfile(UserId:string, FirstName:string, LastName:string, Email:string, Img:string, Bio:string) {
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
    } catch (e:any) {
      throw new BadRequestError(e.message);
    }
  }
}

