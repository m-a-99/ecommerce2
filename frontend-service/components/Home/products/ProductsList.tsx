import Link from "next/link";
import Product from "./components/product/Product";
import Product2 from "./components/product/Product2";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useDispatch } from "react-redux";
import { FetchMoreProducts } from "../../../Redux/products";
import Cookies from "universal-cookie"
import { useState } from "react";


function ProductsList() {
  const cookie = new Cookies();
  const products=useAppSelector(state=>Object.values(state.products.value));
  const hasnext=useAppSelector(state=>state.products.hasNext)
  const  dispatch=useAppDispatch();
  function LoadMore(){
    dispatch(FetchMoreProducts(cookie.get("jwt")))
  }
  return (
    products && (
      <div id="Products" className="flex bg-gray-100 justify-center max-w-screen flex-wrap gap-5 p-10">
        {products.map((product) => (
          <div key={product._id}>
            <Product2 product={product} />
          </div>
        ))}
        {/* {products.map((product) => (
          <div key={product._id}>
            <Product2 product={product} />
          </div>
        ))}
        {products.map((product) => (
          <div key={product._id}>
            <Product2 product={product} />
          </div>
        ))}
        {products.map((product) => (
          <div key={product._id}>
            <Product2 product={product} />
          </div>
        ))} */}
        <div className="flex  w-full mt-5 justify-center items-center ">
          {hasnext ? (
            <div onClick={LoadMore} className="px-4 py-2 bg-indigo-500 rounded-md text-white cursor-pointer select-none">
              Load More
            </div>
          ) : (
            <div className="px-4 py-2 bg-indigo-300 rounded-md text-white  select-none">
              Load More
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default ProductsList;
