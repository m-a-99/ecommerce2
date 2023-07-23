import { IconType } from "./IconsType";

export type GroupType = { _id: string; Name: string; Layout: string; ProductCard: string; PromotionalSliders: string[]; Icon:IconType };

export type GroupsType = GroupType[];
export type BannerType = { Key: string; Title: string; Description: string; Banner: File | null };
export type BannersType = BannerType[];
