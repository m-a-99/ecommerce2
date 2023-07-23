import React, { useEffect, useState } from "react";
import IconsDropList from "../../../../lib/IconsDropList";
import { IconsType } from "../../../../../types/IconsType";
import { CategoriesType, SubCategoryType } from "../../../../../types/CategoriesType";

type props = {
  Icons: IconsType;
  SubCategory: SubCategoryType;
  setSubCategories: (v: SubCategoryType[] | ((v: SubCategoryType[]) => SubCategoryType[])) => void;
  index: number;
};
function SubCategoryCard({ Icons, setSubCategories, SubCategory, index }: props) {
  const [Name, setName] = useState(SubCategory.Name);
  const [Details, setDetails] = useState(SubCategory.Details);
  const [Icon, setIcon] = useState(SubCategory.Icon);

  useEffect(() => {
    if (Name !== SubCategory.Name || Details !== SubCategory.Details || Icon !== SubCategory.Icon) {
      setSubCategories((v) => {
        let tmp = [...v];
        SubCategory.Name !== Name && (tmp[index].Name = Name);
        SubCategory.Details !== Details && (tmp[index].Details = Details);
        SubCategory.Icon !== Icon && (tmp[index].Icon = Icon);
        return tmp;
      });
    }
  }, [Name, Details, Icon]);

  return (
    <div>
      <div className="space-y-1">
        <div className="text-gray-600">Name</div>
        <div className="w-full">
          <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Details</div>
        <div className="w-full">
          <textarea className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Details} onChange={(e) => setDetails(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Icon</div>
        <IconsDropList
          List={Icons.map((v) => {
            return { Id: v._id, Name: v.Name, Url: v.Url };
          })}
          Value={Icon}
          setValue={setIcon}
        />
      </div>
    </div>
  );
}

export default SubCategoryCard;
