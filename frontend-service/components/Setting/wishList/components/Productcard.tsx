import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ProductType } from '../../../../types/ProductType'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { appendCart, deleteFromCart } from '../../../../Redux/cart'
import { unWish } from '../../../../Redux/products'
import { useAppSelector } from '../../../../Redux/hooks'

type Props = {
  Product: ProductType;
  Delete:(src:string,payload:string)=>void
};


function Productcard({ Product, Delete }: Props) {
  const [price, setprice] = useState("");

  const { push } = useRouter();
  const dispatch = useDispatch();
  const AddedCount = useAppSelector((state) => state.cart.value[Product._id]?.Quantity || 0);

  useEffect(() => {
    if (Product?.ProductType === "Simple") {
      setprice("" + Product.SimpleProduct.Price);
    } else {
      const prices = Product.VariableProduct.map((v) => v.Price);
      setprice(`${Math.min(...prices)}-${Math.max(...prices)}`);
    }
  }, [Product]);

  function Add() {
    if (Product.ProductType === "Simple") {
      //setvisable(true);
      dispatch(appendCart(Product));
    } else {
      push("/product/" + Product._id);
    }
  }
  function remove() {
    dispatch(deleteFromCart(Product));
  }

  function addmore() {
    dispatch(appendCart(Product));
  }

  function unWishProduct() {
    Delete("/shopping-service/wish", JSON.stringify({ ProductId: Product._id }));
  }

  return (
    <div className="w-full  h-[100px] justify-between gap-2 flex border-2  border-indigo-100 rounded-md p-2  drop-shadow-lg">
      <div className="flex gap-2 w-2/5">
        <div className="aspect-square">
          <Image alt={Product?.Description} src={"http://nginx-proxy/" + Product?.FeaturedImage} width={200} height={200} className="w-auto object-contain h-auto rounded-lg "></Image>
        </div>
        <div className="flex flex-col py-2 justify-between w-full">
          <div className="text-gray-700 font-semibold">{Product.Name}</div>
          <div className="text-gray-500 text-sm whitespace-nowrap w-full  text-ellipsis  overflow-hidden">{Product.Description}</div>
          <div className="text-gray-700 font-semibold">{price}$</div>
        </div>
      </div>

      <div className="relative flex gap-5 px-4 items-center justify-center">
        <div className="space-y-[4px] ">
          {AddedCount === 0 && (
            <>
              <div onClick={Add} className="bg-indigo-500  hover:bg-indigo-600 hidden lg:flex md:flex  w-[130px] h-[30px]  justify-center items-center select-none  font-bold rounded-lg text-white cursor-pointer">
                Add To Cart +
              </div>
              <div onClick={Add} className="bg-indigo-500  hover:bg-indigo-600 w-[60px] lg:hidden md:hidden h-[30px] flex justify-center items-center select-none  font-bold rounded-lg text-white cursor-pointer">
                Add +
              </div>
            </>
          )}
          {AddedCount > 0 && (
            <>
              <div className="bg-indigo-500 select-none  hidden lg:flex md:flex w-[130px] h-[30px] hover:bg-indigo-600 font-bold rounded-lg text-white cursor-pointer">
                <div className="flex h-full ">
                  <div onClick={remove} className="w-[43.33px] rounded-tl-lg rounded-bl-lg  h-full flex items-center justify-center hover:bg-indigo-500">
                    -
                  </div>
                  <div className="w-[43.33px] flex items-center  justify-center">{AddedCount}</div>
                  <div onClick={addmore} className=" w-[43.33px] rounded-tr-lg rounded-br-lg  h-full flex items-center justify-center hover:bg-indigo-500">
                    +
                  </div>
                </div>
              </div>
              <div className="bg-indigo-500 select-none  w-[60px] lg:hidden md:hidden  h-[30px] hover:bg-indigo-600 font-bold rounded-lg text-white cursor-pointer">
                <div className="flex h-full ">
                  <div onClick={remove} className="w-1/3 rounded-tl-lg rounded-bl-lg  h-full flex items-center justify-center hover:bg-indigo-500">
                    -
                  </div>
                  <div className="w-1/3 flex items-center  justify-center">{AddedCount}</div>
                  <div onClick={addmore} className=" w-1/3 rounded-tr-lg rounded-br-lg  h-full flex items-center justify-center hover:bg-indigo-500">
                    +
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div onClick={unWishProduct} className=" w-7 h-7 flex justify-center items-center rounded-full text-white bg-red-400 cursor-pointer hover:bg-red-500">
          <i className="far fa-xmark"></i>
        </div>
      </div>
    </div>
  );
}

export default Productcard