import { SubCategoryType } from "../../../../types/CategoriesType";
import { IconsType } from "../../../../types/IconsType";
import SubCategoryCard from "./components/SubCategoryCard";

type props = {
  Icons: IconsType;
  SubCategories: SubCategoryType[];
  setDeletedSubCategoriesIds: (v: string[] | ((v: string[]) => string[])) => void;
  setSubCategories: (val: SubCategoryType[] | ((val: SubCategoryType[]) => SubCategoryType[])) => void;
};


const SubCategoriesCard = ({ Icons, setDeletedSubCategoriesIds, SubCategories, setSubCategories }: props) => {
  function deleteSubCategory(id: string) {
    setSubCategories((v) => v.filter((val) => val._id !== id));
    setDeletedSubCategoriesIds((v) => [...v, id]);
  }

  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full ">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Sub Categories</p>
        </div>
        <div className="w-7/12 ">
          {SubCategories.map((cat, index) => (
            <div key={cat._id} className="space-y-3 border-b border-gray-200 pt-6  pb-10 ">
              <div className="flex justify-between">
                <div className="text-gray-600 font-semibold text-lg">Sub Category - {index + 1}</div>
                <div onClick={() => deleteSubCategory(cat._id)} className="text-red-400 hover:text-red-500 cursor-pointer select-none font-semibold text-lg">
                  Remove
                </div>
              </div>
              <SubCategoryCard SubCategory={cat} index={index} Icons={Icons} setSubCategories={setSubCategories} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoriesCard;
