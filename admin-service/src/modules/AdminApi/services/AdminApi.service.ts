import { AdminRepository } from "../../../database/repository/Admin-Repository";
import { filesService } from "../../../services/files.service";
import { usersService } from "../../../services/users.service";
import { BadRequestError } from "../../../utils/app-errors";
import { RemoteService } from "./AdminApi.remote.service";

export class AdminApiService {
  constructor(private repository: AdminRepository, private remoteService: RemoteService, private users_service: usersService, private files_service: filesService) {}
  async createGroup(Name: string, Icon: string, Layout: string, ProductCard: string, PromotionalSliders: string[], Banners: string[], IsMainGroup: boolean) {
    const FilesUrlsOrIds: any = {};
    if (PromotionalSliders && PromotionalSliders.length > 0) {
      PromotionalSliders.forEach((v: any, index) => {
        FilesUrlsOrIds["PromotionalSlider" + (index + 1)] = v;
      });
    }
    if (Banners && Banners.length > 0) {
      Banners.forEach((v: any, index) => {
        FilesUrlsOrIds["Banner" + (index + 1)] = v.Banner;
      });
    }
    if (Object.keys(FilesUrlsOrIds).length > 0) {
      await this.files_service.FilesValidation(FilesUrlsOrIds);
    }
    const group: any = await this.repository.createGroup(Name, Icon, Layout, ProductCard, PromotionalSliders, Banners);
    if (IsMainGroup) {
      await this.repository.setMainGroup(group._id);
    }
    this.remoteService.prodcastGroup_create(group);
    return group;
  }
  async createCategory(Name: string, Details: string, Icon: string, Group: string, IsChildCategory: string, ParentCategory: string) {
    const category = await this.repository.createCategory(Name, Details, Icon, Group, IsChildCategory, ParentCategory);
    await this.remoteService.prodcastCategory_create(category);
    return category;
  }

  async updateCategoryById(_id: string, Name: string, Details: string, Icon: string, Group: string, SubCategories: any[], DeletedSubCategoriesIds: string[]) {
    const category = await this.repository.updateCategoryById(_id, Name, Details, Icon, Group, SubCategories, DeletedSubCategoriesIds);
    await this.remoteService.prodcastCategory_Update(category);
    return category;
  }
  async getGroups() {
    const groups = await this.repository.getGroups();
    return groups;
  }
  async createIcon(Name: string, Url: string) {
    if (Url) {
      await this.files_service.FilesValidation({ Icon: Url });
    }
    const icon = await this.repository.createIcon(Name, Url);
    await this.remoteService.prodcastIcon_create(icon);
    return icon;
  }

  async updateIconById(_id: string, Name: string, Url: string) {
    const icon = await this.repository.updateIconById(_id, Name, Url);
    await this.remoteService.prodcastIcon_update(icon);
    return icon;
  }
  async getIcons() {
    const icons = await this.repository.getIcons();
    return icons;
  }

  async getIconById(_id: string) {
    const icon = await this.repository.getIconById(_id);
    return icon;
  }

  async getCategories() {
    const categories = await this.repository.getCategories();
    return categories;
  }

  async getCategoryById(_id: string) {
    const category = await this.repository.getCategoriesByIds([_id]);
    return category[0];
  }

  async getTags() {
    const tags = await this.repository.getTags();
    return tags;
  }
  async getTagById(id: string) {
    const tag = await this.repository.getTagById(id);
    return tag;
  }

  async createTag(Name: string, Details: string, Icon: string, Group: string) {
    const tag = await this.repository.createTag(Name, Details, Icon, Group);
    await this.remoteService.prodcastTag_create(tag);
    return tag;
  }

  async updateTagById(_id: string, Name: string, Details: string, Icon: string, Group: string) {
    const tag = await this.repository.updateTagById(_id, Name, Details, Icon, Group);
    await this.remoteService.prodcastTag_update(tag);
    return tag;
  }

  async getSocialMediaPlatforms() {
    const socialmediaplatforms = await this.repository.getSocialMediaPlatforms();
    return socialmediaplatforms;
  }
  async getSocialMediaPlatformById(id:string) {
    const socialmediaplatforms = await this.repository.getSocialMediaPlatformById(id);
    return socialmediaplatforms;
  }
  async createGroupUploadUrl(PromotionalSliders: any, Banners: any) {
    if (!PromotionalSliders || Number.parseInt(PromotionalSliders) <= 0) {
      throw new BadRequestError("groups/createuploadurl invalid PromotionalSliders  it must be >=1");
    }
    if (!Banners || Number.parseInt(Banners) <= 0) {
      throw new BadRequestError("groups/createuploadurl invalid Banners  it must be >=1");
    }
    const Fields: any[] = [];
    Fields.push({ name: "PromotionalSliders", maxCount: Number.parseInt(PromotionalSliders) });
    for (let i = 1; i <= Number.parseInt(Banners); i++) {
      Fields.push({ name: "Banner" + i, maxCount: 1 });
    }
    const resData = await this.files_service.CreateUploadUrl({
      Times: 1,
      MaxTime: 1000 * 60 * 10,
      Fields,
      AccessType: "public",
    });
    return resData;
  }

  async createIconUploadUrl() {
    const resData = await this.files_service.CreateUploadUrl({
      Times: 1,
      MaxTime: 1000 * 60 * 10,
      Fields: [{ name: "Icon", maxCount: 1 }],
      AccessType: "public",
    });
    return resData;
  }

  async createSocialMediaPlatformUploadUrl() {
    const resData = await this.files_service.CreateUploadUrl({
      Times: 1,
      MaxTime: 1000 * 60 * 10,
      Fields: [{ name: "Icon", maxCount: 1 }],
      AccessType: "public",
    });
    return resData;
  }

  async createSocialMediaPlatform(Icon: string, Name: string) {
    const socialmediaplatform = await this.repository.createSocialMediaPlatform(Icon, Name);
    await this.remoteService.prodcastSocialmediaPlatform_create(socialmediaplatform);
    return socialmediaplatform;
  }

  async updateSocialMediaPlatform(id: string, Name: string, Icon: string) {
    const socialmediaplatform = await this.repository.updateSocialMediaPlatform(id, Name, Icon);
    await this.remoteService.prodcastSocialmediaPlatform_update(socialmediaplatform);
    return socialmediaplatform;
  }
  async checkAuth(token: string) {
    return await this.users_service.checkAuth(token);
  }
}
