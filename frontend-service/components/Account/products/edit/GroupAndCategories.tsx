import { AuthersType } from "../../../../types/AuthersType";
import { CategoriesType } from "../../../../types/CategoriesType";
import { GroupsType } from "../../../../types/GroupsType";
import { ManufacturersType } from "../../../../types/ManufacturersType";
import { TagsType } from "../../../../types/TagsType";
import DropList from "../../../lib/DropList";
import MultiDropList from "../../../lib/MultiDropList";

type props = {
  Group: string;
  setGroup: (v: string) => void;
  Categories: string[];
  setCategories: (v: string[] | ((v: string[]) => string[])) => void;
  Authors: string[];
  setAuthors: (v: string[] | ((v: string[]) => string[])) => void;
  Manufacturers: string[];
  setManufacturers: (v: string[] | ((v: string[]) => string[])) => void;
  Tags: string[];
  setTags: (v: string[] | ((v: string[]) => string[])) => void;
  tags: TagsType;
  manufacturers: ManufacturersType;
  authors: AuthersType;
  categories:CategoriesType
  groups:GroupsType
};

function GroupAndCategories({ Group, setGroup, Authors,Categories,Manufacturers,Tags,authors,categories,groups,manufacturers,setAuthors,setCategories,setManufacturers,setTags,tags }: props) {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Group & Categories</p>
          <p className="text-sm text-gray-400"> Select product group and categories from here</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Group*</div>
            <div className="w-full">
              <DropList
                List={groups.map((v) => {
                  return { Id: v._id, Name: v.Name };
                })}
                Value={Group}
                setValue={setGroup}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Categories</div>
            <div className="w-full">
              <MultiDropList
                List={categories.map((v) => {
                  return { Id: v._id, Name: v.Name };
                })}
                Value={Categories}
                setValue={setCategories}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Authors</div>
            <div className="w-full">
              <MultiDropList
                List={authors.map((v) => {
                  return { Id: v._id, Name: v.Name };
                })}
                Value={Authors}
                setValue={setAuthors}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Manufacturers</div>
            <div className="w-full">
              <MultiDropList
                List={manufacturers.map((v) => {
                  return { Id: v._id, Name: v.Name };
                })}
                Value={Manufacturers}
                setValue={setManufacturers}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Tags</div>
            <div className="w-full">
              <MultiDropList
                List={tags.map((v) => {
                  return { Id: v._id, Name: v.Name };
                })}
                Value={Tags}
                setValue={setTags}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupAndCategories;
