import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../Redux/hooks";
import { CategoriesType } from "../../types/CategoriesType";
import Cart from "./cart/Cart";
import CartList from "./cart/cartList/CartList";

type props = {
  categories: CategoriesType
};
const FilterCard = ({ categories }: props) => {

  const [Categoriesmount, setCategoriesmount] = useState(false);
  const [Categoriesdown, setCategoriesdown] = useState(false);
  const mouseovercategory = useRef(false);

  function cat() {
    if (!mouseovercategory.current) setCategoriesdown(false);
  }
  useEffect(() => {
    window.addEventListener("click", cat);
    return () => {
      window.removeEventListener("click", cat);
    };
  }, []);

  function CategoriesAnimationEnd() {
    if (!Categoriesdown) {
      setCategoriesmount(false);
      setCategoriesdown(false);
    }
  }

  return (
    <>
      <div id="FilterCard" className="bg-gray-50 py-5 px-10 md:px-20 lg:px-24 flex items-center justify-between max-h-16 sticky top-[60px]  z-20 drop-shadow-sm">
        <div
          onMouseOver={() => {
            mouseovercategory.current = true;
          }}
          onMouseLeave={() => {
            mouseovercategory.current = false;
          }}
          className=" relative"
        >
          <div
            onClick={() => {
              setCategoriesdown((v) => !v);
              setCategoriesmount(true);
            }}
            className="  hover:bg-gray-300 select-none cursor-pointer font-semibold flex items-center justify-center border-[1px]  rounded-md space-x-2 py-2 px-3 "
          >
            <i className="fa-regular fa-filter"></i>
            <span className="hidden lg:block md:block">Categories</span>
          </div>
          {Categoriesmount && (
            <>
              {/* categories button + */}
              <div onAnimationEnd={CategoriesAnimationEnd} className={`${Categoriesdown ? "animate-growdown" : "animate-growup"} absolute bg-white  rounded-md border-[1px] animate-grow origin-top border-gray-300 top-12 p-5 drop-shadow-xl  whitespace-nowrap `}>
                {/*categories button - */}
                {/* categories list + */}
                <ul className="text-gray-800 space-y-2 font-semibold">
                  {categories &&
                    categories.map((v) => (
                      <li key={v._id} className="flex items-center space-x-2 cursor-pointer select-none hover:bg-gray-200 p-2">
                        <div className="w-5  text-transparent bg-clip-text bg-black">
                          <img width={20} height={20} alt={v.Name} src={v.Icon} />
                        </div>

                        <div>{v.Name.charAt(0).toUpperCase() + v.Name.substring(1)}</div>
                      </li>
                    ))}
                </ul>
                {/* categories list - */}
              </div>
            </>
          )}
        </div>
        {/* filter card + */}
        <div className=" select-none flex space-x-2 md:space-x-5 lg:space-x-5 items-center ">
          <div className="cursor-pointer lg:w-20 md:w-20 text-center rounded-full bg-gradient-to-r from-indigo-600  to-blue-400 text-slate-50 font-semibold  p-2">Popular</div>
          <div className="cursor-pointer lg:w-20 md:w-20 text-center rounded-full hover:bg-gradient-to-r hover:text-slate-50 from-indigo-600 p-2 to-blue-400">Hot</div>
          <div className=" cursor-pointer lg:w-20 md:w-20  text-center rounded-full hover:bg-gradient-to-r hover:text-slate-50  from-indigo-600 p-2 to-blue-400">Recent</div>
        </div>
        {/* filter card -*/}

        {/* cart card + */}
        {/* cart card + */}
      </div>
    </>
  );
};

export default FilterCard;
