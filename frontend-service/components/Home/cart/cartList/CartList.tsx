import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../Redux/hooks";
import CartIteam from "./components/CartItem";

type props = {
  Animationend: () => void;
  setcartListAnimation: (v: string) => void;
  cartListAnimation: string;
};
const CartList = ({
  Animationend,
  setcartListAnimation,
  cartListAnimation,
}: props) => {
  const [itemsCount, setitemsCount] = useState(0);
  const cart = useAppSelector((state) => state.cart.value);

  useEffect(()=>{
    if(cart){
      setitemsCount(Object.keys(cart).length)
    }
  },[cart])

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="bg-black scroll bg-opacity-60 w-full h-screen fixed top-0 right-0 z-40 flex justify-end">
      <div onAnimationEnd={Animationend} className={`bg-gray-100 shadow-xl border-[1px] border-gray-100 drop-shadow-xl  z-40  w-[350px] h-screen  origin-right ${cartListAnimation}`}>
        <div className="flex items-center justify-between p-4 border-b-2 bg-white border-gray-300">
          <div onClick={() => setcartListAnimation("animate-growright")} className="rounded-full flex justify-center items-center m-2 bg-gradient-to-r from-indigo-600 to-blue-400  hover:from-red-400 hover:to-red-400 cursor-pointer w-8 h-8 drop-shadow-xl text-white">
            <i className="fa-regular fa-xmark"></i>
          </div>
          <div className="font-semibold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
            <i className="fa-solid fa-cart-plus m-2 text-lg "></i>
            {itemsCount > 1 ? `${itemsCount} items` : `${itemsCount} item`}
          </div>
        </div>
        <div className="overflow-y-scroll h-[calc(100%-160px)] scrollbar-thin">
          {Object.values(cart).map((item) => (
            <div key={item.Product.ProductType === "Simple" ? item.Product._id : item.Product.VariableProduct[0]._id}>
              <CartIteam item={item} />
            </div>
          ))}
        </div>
        {itemsCount > 0 ? (
          <Link href={"/checkout"}>
            <div className=" drop-shadow-2xl cursor-pointer transition duration-75 hover:to-blue-500 select-none bg-gradient-to-r from from-indigo-600 to-blue-400 p-1 rounded-full mx-4 flex justify-between ">
              <div className="p-2 font-semibold text-white">Checkout</div>
              <div className="bg-white p-2 px-4 rounded-full ">
                <div className="text-zinc-800">${Object.values(cart).reduce((previousValue, currentValue, currentIndex, array) => currentValue.Quantity * ((currentValue.Product.ProductType === "Simple" ? currentValue.Product.SimpleProduct.Price : currentValue.Product.VariableProduct[0].Price) || 0) + previousValue, 0)}</div>
              </div>
            </div>
          </Link>
        ) : (
            <div className=" drop-shadow-2xl  transition duration-75  select-none bg-gradient-to-r from from-indigo-400 to-blue-300 p-1 rounded-full mx-4 flex justify-between ">
              <div className="p-2 font-semibold text-white">Checkout</div>
              <div className="bg-white p-2 px-4 rounded-full ">
                <div className="text-zinc-800">${Object.values(cart).reduce((previousValue, currentValue, currentIndex, array) => currentValue.Quantity * ((currentValue.Product.ProductType === "Simple" ? currentValue.Product.SimpleProduct.Price : currentValue.Product.VariableProduct[0].Price) || 0) + previousValue, 0)}</div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartList;
