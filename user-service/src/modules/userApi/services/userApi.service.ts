import { UserRepository } from "../../../database";
import { UsersModel } from "../../../database/models";
import { filesService } from "../../../services/files.service";
import { comparehash, generateJwtToken, hash, verify_token } from "../../../utils";
import { APIError, BadRequestError, ValidationError } from "../../../utils/app-errors";
import { userApiRemoteService } from "./userApi.remote.service";

type Feilds = {
  Fields: { name: string; maxCount: number }[];
  Times: number;
  MaxTime: number;
  AccessType: string;
};

export class userApiService {
  constructor(private repository: UserRepository, private remoteService: userApiRemoteService, private files_service: filesService) {}

  async signin(Email: string, Password: string) {
    await this.validateSignin(Email, Password);

    const user: any = await this.repository.getUserByEmail(Email);

    if (!user) {
      throw new ValidationError(JSON.stringify({ Email: "Invalid Email" }));
    }

    const PasswordValidation = comparehash(Password, user.Password);
    if (!PasswordValidation) {
      throw new ValidationError(JSON.stringify({ Password: "Invalid Password" }));
    }
    const token = generateJwtToken(user._id);
    return token;
  }

  async signup(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string, ConfirmationPassword: string) {
    await this.#validateSignup(FirstName, LastName, Email, AccountType, Password, ConfirmationPassword);
    const PasswordHash = hash(Password);
    const user: any = await this.repository.createUser(FirstName, LastName, Email, AccountType, PasswordHash);
    const token = generateJwtToken(user._id);
    return token;
  }

  async CreateSubAdmin(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string, ConfirmationPassword: string) {
    await this.#CreateSubAdminValidation(FirstName, LastName, Email, AccountType, Password, ConfirmationPassword);
    const PasswordHash = hash(Password);
    const user: any = await this.repository.createUser(FirstName, LastName, Email, AccountType, PasswordHash);
    // const token = generateJwtToken(user._id);
    return user;
  }

  async CreateSubSeller(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string, ConfirmationPassword: string) {
    await this.#CreateSubSellerValidation(FirstName, LastName, Email, AccountType, Password, ConfirmationPassword);
    const PasswordHash = hash(Password);
    const user: any = await this.repository.createUser(FirstName, LastName, Email, AccountType, PasswordHash);
    // const token = generateJwtToken(user._id);
    return user;
  }

  async ResolveUserByToken(token: string) {
    let decoded_token = verify_token((token || "").split(" ")[1]);
    const user = await this.repository.getUserById(decoded_token);
    return user;
  }

  async UpdateProfile(UserId: string, FirstName: string, LastName: string, Email: string, Img: string, Bio: string) {
    return await this.repository.UpdateProfile(UserId, FirstName, LastName, Email, Img, Bio);
  }

  async AddContact(UserId: string, Title: string, Value: string) {
    return await this.repository.AddContact(UserId, Title, Value);
  }
  async DeleteContact(UserId: string, ContactId: string) {
    return await this.repository.DeleteContact(UserId, ContactId);
  }
  async setAddress(UserId: string, AddressType: string, Title: string, Country: string, City: string, State: string, Zip: string, StreetAddress: string) {
    return await this.repository.setAddress(UserId, AddressType, Title, Country, City, State, Zip, StreetAddress);
  }

  async DeleteAddress(UserId: string, AddressType: string) {
    return await this.repository.DeleteAddress(UserId, AddressType);
  }

  async updateStatus(UserId: string, Status: string, Message: string) {
    return await this.repository.updateStatus(UserId, Status, Message);
  }

  async addSubAdmin(FirstName:string, LastName:string, Email:string, Password:string,Img:string) {
    try{
      const PasswordHash = hash(Password);
      const user = new UsersModel({
        AccountType:"SubAdmin",
        FirstName,
        LastName,
        Email,
        Password: PasswordHash,
        Img
      });
      await user.save();
      const res:any=user.toObject()
      delete res.Password
      return res;
    }catch(e:any){
      throw new APIError(e.message)
    }
  }

  async ChangePassword(UserId: string, OldPassword: string, NewPassword: string, ConfirmationPassword: string) {
    await this.#validatePassword(NewPassword, ConfirmationPassword);
    const user = await this.repository.GetUserById(UserId);
    const CheckOld = comparehash(OldPassword, user.Password);
    if (!CheckOld) {
      throw new BadRequestError("Invalid Old Password");
    }
    const NewPasswordHash = hash(NewPassword);
    await this.repository.ChangePassword(UserId, NewPasswordHash);
    return { ok: true, message: "password changed successfuly" };
  }

  /*****************************************************************************/
  async getUsers(Role: string, Page: number) {
    return await this.repository.getUsers(Role, Page, 5);
  }
  /*****************************************************************************/
  async getUserById(UserId: string) {
    return await this.repository.getUserById(UserId);
  }
  async #CreateSubAdminValidation(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string, ConfirmationPassword: string) {
    let err: any = {};
    if (!FirstName) {
      err["FirstName"] = "First Name Required";
    }
    if (!LastName) {
      err["LastName"] = "Last Name Required";
    }
    if (!Email || !Email.includes("@") || Email.split("@").length !== 2) {
      err["Email"] = "Invalid Email";
    } else {
      const _user = await this.repository.getUserByEmail(Email);
      if (_user) {
        err["Email"] = "This Email Is Used By Another Account";
      }
    }
    if (AccountType !== "SubAdmin") {
      if (!AccountType) {
        err["AccountType"] = "Account Type Requried";
      } else {
        err["AccountType"] = "Invalid Account Type";
      }
    }
    if (!Password || Password.length < 6) {
      err["Password"] = "Password Must Be More Then 6 Characters";
    }
    if (!Password || !ConfirmationPassword || Password !== ConfirmationPassword) {
      err["ConfirmationPassword"] = "Confirmation Password Do Not Match Password";
    }
    if (Object.keys(err).length > 0) {
      throw new ValidationError(JSON.stringify(err));
    }
  }
  async #CreateSubSellerValidation(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string, ConfirmationPassword: string) {
    let err: any = {};
    if (!FirstName) {
      err["FirstName"] = "First Name Required";
    }
    if (!LastName) {
      err["LastName"] = "Last Name Required";
    }
    if (!Email || !Email.includes("@") || Email.split("@").length !== 2) {
      err["Email"] = "Invalid Email";
    } else {
      const _user = await this.repository.getUserByEmail(Email);
      if (_user) {
        err["Email"] = "This Email Is Used By Another Account";
      }
    }
    if (AccountType !== "SubSeller") {
      if (!AccountType) {
        err["AccountType"] = "Account Type Requried";
      } else {
        err["AccountType"] = "Invalid Account Type";
      }
    }
    if (!Password || Password.length < 6) {
      err["Password"] = "Password Must Be More Then 6 Characters";
    }
    if (!Password || !ConfirmationPassword || Password !== ConfirmationPassword) {
      err["ConfirmationPassword"] = "Confirmation Password Do Not Match Password";
    }
    if (Object.keys(err).length > 0) {
      throw new ValidationError(JSON.stringify(err));
    }
  }
  async #validateSignup(FirstName: string, LastName: string, Email: string, AccountType: string, Password: string, ConfirmationPassword: string) {
    let err: any = {};
    if (!FirstName) {
      err["FirstName"] = "First Name Required";
    }
    if (!LastName) {
      err["LastName"] = "Last Name Required";
    }
    if (!Email || !Email.includes("@") || Email.split("@").length !== 2) {
      err["Email"] = "Invalid Email";
    } else {
      const _user = await this.repository.getUserByEmail(Email);
      if (_user) {
        err["Email"] = "This Email Is Used By Another Account";
      }
    }
    if (!["Seller", "Client"].includes(AccountType)) {
      if (!AccountType) {
        err["AccountType"] = "Account Type Requried";
      } else {
        err["AccountType"] = "Invalid Account Type";
      }
    }
    if (!Password || Password.length < 6) {
      err["Password"] = "Password Must Be More Then 6 Characters";
    }
    if (!Password || !ConfirmationPassword || Password !== ConfirmationPassword) {
      err["ConfirmationPassword"] = "Confirmation Password Do Not Match Password";
    }
    if (Object.keys(err).length > 0) {
      throw new ValidationError(JSON.stringify(err));
    }
  }
  private async validateSignin(Email: string, Password: string) {
    const err: any = {};
    if (!Email) {
      err["Email"] = "Email Required";
    }
    if (!Password) {
      err["Password"] = "Password Required";
    }
    if (Object.keys(err).length > 0) {
      throw new ValidationError(JSON.stringify(err));
    }
  }

  async #validatePassword(Password: string, ConfirmationPassword: string) {
    let err: any = {};
    if (!Password || Password.length < 6) {
      err["Password"] = "Password Must Be More At least 6 Characters";
    }
    if (!Password || !ConfirmationPassword || Password !== ConfirmationPassword) {
      err["ConfirmationPassword"] = "Confirmation Password Do Not Match Password";
    }
    if (Object.keys(err).length > 0) {
      throw new ValidationError(JSON.stringify(err));
    }
  }
  async profile(id: string) {
    const profile = await this.repository.getProfile(id);
    return profile;
  }

  async SubscribeEvents(payload: any) {
    console.log("Triggering.... Customer Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    const {} = data;

    // switch (event) {
    //     case 'ADD_TO_WISHLIST':
    //     case 'REMOVE_FROM_WISHLIST':
    //         this.AddToWishlist(userId, product)
    //         break;
    //     case 'ADD_TO_CART':
    //         this.ManageCart(userId, product, qty, false);
    //         break;
    //     case 'REMOVE_FROM_CART':
    //         this.ManageCart(userId, product, qty, true);
    //         break;
    //     case 'CREATE_ORDER':
    //         this.ManageOrder(userId, order);
    //         break;
    //     default:
    //         break;
    // }
  }

  async CreateProfileUploadUrl() {
    return await this.files_service.CreateUploadUrl({
      Fields: [{ name: "Img", maxCount: 1 }],
      Times: 1,
      MaxTime: 10 * 60 * 10,
      AccessType: "public",
    });
  }
}
