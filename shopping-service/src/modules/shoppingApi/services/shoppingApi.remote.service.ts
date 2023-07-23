import { MSGQ } from "../../../utils";
import { APIError, BadRequestError } from "../../../utils/app-errors";

export class shoppingApiRemoteService {
  constructor(private msgq: MSGQ) {}
  // async JoinSocialPaltforms(fields: any) {
  //   const Ids: any = [];
  //   for (let field of fields) {
  //     for (let SocialMediaPlatform of field.SocialProfiles) {
  //       Ids.push(SocialMediaPlatform.SocialMediaPlatform);
  //     }
  //   }
  //   const resfield = await this.#RPCgetSocialMediaPlatforms(Ids);
  //   const fieldsResult = fields.map((field: any) => {
  //     const fieldObj = field.toObject();
  //     fieldObj.SocialProfiles = fieldObj.SocialProfiles.map((SocialProfile: any) => {
  //       SocialProfile.SocialMediaPlatform = resfield[SocialProfile.SocialMediaPlatform.toString()];
  //       return SocialProfile;
  //     });
  //     return fieldObj;
  //   });

  //   return fieldsResult;
  // }


 
  // async ProductsJoin(products: any) {
  //   const GroupsIds: any = [];
  //   const CategoriesIds: any = [];
  //   const ManufacturersIds: any = [];
  //   const AuthorsIds: any = [];
  //   const TagsIds: any = [];
  //   const AttribuetsIds: any = [];

  //   const productsobjs: any = [];
  //   products.forEach((product: any) => {
  //     product.Group && GroupsIds.push(product.Group);
  //     product.Categories && CategoriesIds.push(product.Categories);
  //     product.Manufacturers && ManufacturersIds.push(...product.Manufacturers);
  //     product.Tags && TagsIds.push(...product.Tags);
  //     product.Authors && AuthorsIds.push(...product.Authors);
  //     product.VariableProduct &&
  //       product.VariableProduct.forEach((e: any) => {
  //         e.VarientAttributesValues.forEach((a: any) => AttribuetsIds.push(a.Attribute.Id));
  //       });
  //     productsobjs.push(product.toObject());
  //   });
  //   const resData = await Promise.all([this.#RPCgetGroups(GroupsIds), this.#RPCgetCategories(CategoriesIds), this.#RPCgetManufacturers(ManufacturersIds), this.#RPCgetAuthors(AuthorsIds), this.#RPCgetTags(TagsIds), this.#RPCgetAttributes(AttribuetsIds)]);
  //   const [Groups, Categories, Manufacturers, Authors, Tags, Attribuets] = resData;
  //   return productsobjs.map((e: any) => {
  //     e.Group && (e.Group = Groups[e.Group.toString()]);
  //     e.Categories && (e.Categories = e.Categories.map((v: any) => Categories[v.toString()]));
  //     e.Authors && (e.Authors = e.Authors.map((v: any) => Authors[v.toString()]));
  //     e.Manufacturers && (e.Manufacturers = e.Manufacturers.map((v: any) => Manufacturers[v.toString()]));
  //     e.Tags && (e.Tags = e.Tags.map((v: any) => Tags[v.toString()]));
  //     e.Tags && (e.Tags = e.Tags.map((v: any) => Tags[v.toString()]));
  //     e.VariableProduct &&
  //       e.VariableProduct.map((varient: any) => {
  //         varient.VarientAttributesValues = varient.VarientAttributesValues.map((a: any) => {
  //           a.Attribute = Attribuets[a.Attribute.Id.toString()];
  //           a.Attribute.Id = a.Attribute._id;
  //           a.Value = Attribuets[a.Attribute.Id.toString()].AttributeValues.find((val: any) => a.Value.Id.toString() === val._id);
  //           a.Value.Id = a.Value._id;
  //           // delete a.Attribute.AttributeValues;
  //           return a;
  //         });
  //         return varient;
  //       });
  //     return e;
  //   });
  // }
  async prodcastWishList_create(data: any) {
    await this.msgq.emit(JSON.stringify(data), "WishList.Create", "DB-PRODCAST");
  }
  async prodcastWishList_delete(data: any) {
    await this.msgq.emit(JSON.stringify(data), "WishList.Delete", "DB-PRODCAST");
  }
}
