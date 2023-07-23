import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { appendCart, deleteFromCart } from "../../../../../Redux/cart";
import { useAppSelector } from "../../../../../Redux/hooks";
import { RootState } from "../../../../../Redux/store";
import { ProductType } from "../../../../../types/ProductType";

import FlyImg from "./components/FlyImg";

type props = {
  product: ProductType;
};
const Product = ({ product }: props) => {
  const [wished, setwished] = useState(false);
  const [visable, setvisable] = useState(false);
  const [flysrc, setflysrc] = useState<string>();
  const AddedCount = useAppSelector((state) => state.cart.value[product._id]?.Quantity || 0);

  const {push,}=useRouter()
  useEffect(() => {
    const img: HTMLImageElement | undefined = document.querySelector("#id" + product._id) as HTMLImageElement;
    if (img) {
      setflysrc(img.src);
    }
  }, []);

  const count = useAppSelector((state: RootState) => state.cart.value);
  const dispatch = useDispatch();

  function add() {
    if (product.ProductType === "Simple") {
      setvisable(true);
      dispatch(appendCart(product));
    }
    else{
      push("/product/"+product._id)

    }
  }
  function Animationend() {
    setvisable(false);
  }

  function addmore() {
    dispatch(appendCart(product));
  }
  function remove() {
    dispatch(deleteFromCart(product));
  }

  return (
    <>
      {visable && flysrc && <FlyImg imgsrc={flysrc} Animationend={Animationend} />}
      <div className="w-full bg-white drop-shadow-sm rounded-2xl shadow-xl  transition  md:lg:hover:scale-105 lg:hover:scale-105 h-min">
        <div className="-top-16 w-11/12 relative rounded-lg left-1/2 transform -translate-x-1/2 drop-shadow-lg">
          <div className="absolute w-full flex justify-between  z-10 ">
            <div className="text-[14px] h-6 font-medium bg-blacktrans drop-shadow-lg  text-white flex justify-center items-center w-20 rounded-full m-1 bg-opacity-80">Sale</div>

            {!wished && (
              <div onClick={() => setwished((w) => !w)} className=" cursor-pointer  shadow-lg w-10 mr-1 h-10 flex justify-center items-center  rounded-full bg-white drop-shadow-lg">
                <i className="fat text-xl mt-1 transition ease-out duration-75  fa-heart text-gray-600"></i>
              </div>
            )}
            {wished && (
              <div onClick={() => setwished((w) => !w)} className=" bg-red-100 shadow-red-300  cursor-pointer shadow-lg w-10 mr-1 h-10 flex justify-center items-center  rounded-full drop-shadow-lg">
                <i className="fas text-xl mt-1 transition ease-in duration-75 fa-heart text-rose-500"></i>
              </div>
            )}
          </div>
          <div className="cursor-pointer ">
            <Link href={`/product/${product._id}`}>
              <div className="flex justify-center">
                <Image width={200} height={200} alt={product.Name} id={"id" + product._id} src={"http://nginx-proxy" + product.FeaturedImage || ""} className="rounded-2xl w-auto h-auto" priority />
              </div>
            </Link>
          </div>
        </div>

        <h4 className="px-3 m-1 text-sm text-gray-400">{product.Description}</h4>
        <div className="p-3 flex justify-between">
          {product.ProductType === "Simple" && <div className="font-extrabold text-lg mt-2">$ {product.SimpleProduct.Price}</div>}

          {product.ProductType === "Variable" && <div className="font-extrabold text-lg mt-2">$ {product.VariableProduct[0].Price}</div>}

          {AddedCount === 0 && (
            <div onClick={add} className="bg-zinc-600 p-2 select-none hover:bg-zinc-700  text-[14px] font-bold rounded-lg text-white cursor-pointer">
              Add +
            </div>
          )}

          {AddedCount > 0 && (
            <div className="bg-zinc-600 select-none hover:bg-zinc-700  text-[14px] font-bold rounded-lg text-white cursor-pointer">
              <div className="flex h-full ">
                <div onClick={remove} className=" rounded-tl-lg rounded-bl-lg px-2 h-full flex items-center hover:bg-zinc-500">
                  -
                </div>
                <div className="px-2 flex items-center">{AddedCount}</div>
                <div onClick={addmore} className="rounded-tr-lg rounded-br-lg px-2 h-full flex items-center hover:bg-zinc-500">
                  +
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
