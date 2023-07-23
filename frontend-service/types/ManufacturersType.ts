import { SocialMediaPlatformType, SocialProfilesType } from "./SotialProfilesType";

export type SocialMediaPlatformProfile={_id:string,Url:string,SocialMediaPlatform:SocialMediaPlatformType}
export type ManufacturerType = { _id: string; Logo: string; ShopId: string; CoverImage: string; Name: string; Website: string; Description: string; Group: string; SocialProfiles: SocialMediaPlatformProfile[] };
export type ManufacturersType = ManufacturerType[];
