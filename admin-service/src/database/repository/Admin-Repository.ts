import { APIError, BadRequestError } from "../../utils/app-errors";
import { GroupsModel, CategoriesModel, MainGroupModel, IconsModel, TagsModel, SocialMediaPlatformsModel, FilesModel } from "../models";
import mongoose from "mongoose";

export class AdminRepository {
  async createGroup(Name: string, Icon: string, Layout: string, ProductCard: string, PromotionalSliders: any, Banners: any) {
    try {
      const group = new GroupsModel({
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
  async createCategory(Name: string, Details: string, Icon: string, Group: string, IsChildCategory: string, ParentCategory: string) {
    try {
      let category;

      if (IsChildCategory) {
        category = await CategoriesModel.findById(ParentCategory);
        if (!category) {
          throw new BadRequestError("Parent Category not found");
        }
        category.SubCategories.push({
          Name,
          Details,
          Icon,
        });
      } else {
        category = new CategoriesModel({
          Name,
          Details,
          Icon,
          Group,
        });
      }
      await category.save();
      return category;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async updateCategoryById(_id: string, Name: string, Details: string, Icon: string, Group: string, SubCategories: any[], DeletedSubCategoriesIds: string[]) {
    try {
      const category = await CategoriesModel.findById(_id);
      if (!category) {
        throw new BadRequestError(`category with id ${_id} not found`);
      }
      Name && (category.Name = Name);
      Details && (category.Details = Details);
      Icon && (category.Icon = new mongoose.Types.ObjectId(Icon));
      Group && (category.Group = new mongoose.Types.ObjectId(Group));
      if (Array.isArray(SubCategories)) {
        const tmp: any = {};
        SubCategories.forEach((sub) => {
          tmp[sub._id] = sub;
        });
        category.SubCategories.forEach((sub) => {
          if (tmp["" + sub._id]) {
            tmp["" + sub._id].Name && (sub.Name = tmp["" + sub._id].Name);
            tmp["" + sub._id].Details && (sub.Details = tmp["" + sub._id].Details);
            tmp["" + sub._id].Icon && (sub.Icon = tmp["" + sub._id].Icon);
            delete tmp["" + sub._id];
          }
        });
        Object.values(tmp).forEach((v: any) => {
          category.SubCategories.push({ Name: v.Name, Details: v.Details, Icon: v.Icon });
        });
        if (Array.isArray(DeletedSubCategoriesIds)) {
          category.SubCategories.forEach((v) => {
            if (DeletedSubCategoriesIds.includes("" + v._id)) {
              category.SubCategories.pull({ _id: v._id });
            }
          });
        }
        await category.save();
        return category;
      }

      await category.save();
      return category;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

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
  async getGroups() {
    try {
      const groups = await GroupsModel.aggregate([{ $lookup: { from: "Icons", localField: "Icon", foreignField: "_id", as: "Icon" } }, { $unwind: "$Icon" }, { $project: { _id: 1, Name: 1, Icon: "$Icon.Url", Layout: 1, ProductCard: 1, PromotionalSliders: 1 } }]);
      return groups;
    } catch (e: any) {
      throw new APIError("db error cant get groups ", e.message);
    }
  }

  async createIcon(Name: string, Url: string) {
    try {
      const icon = new IconsModel({
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
      return icon;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getIcons() {
    try {
      const icons = await IconsModel.find({}).sort({ createdAt: -1 }).select("_id Name Url");
      return icons;
    } catch (e: any) {
      throw new APIError("db error cant get icons", e.message);
    }
  }
  async getIconById(_id: string) {
    try {
      const icon = await IconsModel.findById(_id);
      if (!icon) {
        throw new BadRequestError(`icon with id ${_id} not found `);
      }
      return icon;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }

  async getCategories() {
    try {
      const categories = await CategoriesModel.aggregate([
        {
          $lookup: {
            from: "Icons",
            localField: "Icon",
            foreignField: "_id",
            as: "Icon",
          },
        },
        { $unwind: "$Icon" },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            as: "Group",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              {
                $unwind: "$Icon",
              },
            ],
          },
        },
        { $unwind: "$Group" },
        { $project: { _id: 1, Name: 1, Details: 1, Icon: "$Icon.Url", Group: { _id: "$Group._id", Name: "$Group.Name", Icon: "$Group.Icon.Url" } } },
      ]);
      return categories;
    } catch (e: any) {
      throw new APIError("db error cant get Categories", e.message);
    }
  }

  async getTags() {
    try {
      const tags = await TagsModel.aggregate([
        {
          $lookup: {
            from: "Icons",
            localField: "Icon",
            foreignField: "_id",
            as: "Icon",
          },
        },
        { $unwind: "$Icon" },
        {
          $lookup: {
            from: "Groups",
            localField: "Group",
            foreignField: "_id",
            as: "Group",
            pipeline: [
              {
                $lookup: {
                  from: "Icons",
                  localField: "Icon",
                  foreignField: "_id",
                  as: "Icon",
                },
              },
              {
                $unwind: "$Icon",
              },
            ],
          },
        },
        { $unwind: "$Group" },
        { $project: { _id: 1, Name: 1, Details: 1, Icon: "$Icon.Url", Group: { _id: "$Group._id", Name: "$Group.Name", Icon: "$Group.Icon.Url" } } },
      ]);
      return tags;
    } catch (e: any) {
      throw new APIError("db error cant get Tags", e.message);
    }
  }
  async getTagById(_id: string) {
    try {
      const tag = await TagsModel.findById(_id);
      if (!tag) {
        throw new BadRequestError(`tag with id ${_id} not found`);
      }
      return tag;
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  }
  async createTag(Name: string, Details: string, Icon: string, Group: string) {
    try {
      const tag = new TagsModel({
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

  async getSocialMediaPlatforms() {
    try {
      const socialmediaplatforms = await SocialMediaPlatformsModel.find({});
      return socialmediaplatforms;
    } catch (e: any) {
      throw new APIError("db error cant get Social Platforms", e.message);
    }
  }
  async createSocialMediaPlatform(Icon: string, Name: string) {
    try {
      const socialmediaplatform = new SocialMediaPlatformsModel({ Icon, Name });
      await socialmediaplatform.save();
      return socialmediaplatform;
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
  async getSocialMediaPlatformById(Id: string) {
    try {
      const socioalmediaplatform = await SocialMediaPlatformsModel.findById(Id);
      return socioalmediaplatform;
    } catch (e: any) {
      throw new APIError("GetSocialMediaPlatformById error ", e.message);
    }
  }
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
}
