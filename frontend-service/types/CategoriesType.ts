import { GroupType } from "./GroupsType";

export type SubCategoryType = {
  _id: string;
  Name: string;
  Details: string;
  Icon: string;
};
export type CategoryType = {
  _id: string;
  Name: string;
  Details: string;
  Group: GroupType;
  Icon: string;
  SubCategories: [SubCategoryType];
};
export type CategoriesType = CategoryType[];
