import { useState } from "react";
import Slider from "../lib/Slider";

function BannersCard() {
  const [Search, setSearch] = useState("")
  function goshopping(){
    const products=document.getElementById("FilterCard")
    if(products)
    window.scrollTo({
      top: products?.offsetTop,
      behavior: "smooth",
    });
  }
  return (
    <div className="relative w-full h-screen">
      {/* <Swiper>
        <div className="bg-home  space-y-2 bg-cover  flex-col flex justify-center items-center  h-screen ">
          <div className="bg-black/40 p-10 rounded-xl flex flex-col items-center justify-center  text-center w-full h-full ">
            <h1 className="text-white font-sans text-[45px] font-bold">Groceries Delivered in 90 Minute</h1>
            <h3 className="text-slate-100 text-[15px] font-semibold">Get your healthy foods & snacks delivered at your doorsteps all day everyday</h3>
            <a href="#FilterCard"><div className="px-6 w-max py-2 bg-indigo-500 mt-4 text-white drop-shadow-lg rounded-md">Go Shopping ...</div></a>
          </div>
        </div>
        <div className="bg-home2  space-y-2 bg-cover  flex-col flex justify-center items-center  h-screen ">
          <div className="bg-black/40 p-10 rounded-xl  flex flex-col items-center justify-center text-center w-full h-full ">
            <h1 className="text-white font-sans text-[45px] font-bold">Groceries Delivered in 90 Minute</h1>
            <h3 className="text-slate-100 text-[15px] font-semibold">Get your healthy foods & snacks delivered at your doorsteps all day everyday</h3>
            <a href="#FilterCard"><div className="px-6 w-max py-2 bg-indigo-500 mt-4 text-white drop-shadow-lg rounded-md">Go Shopping ...</div></a>
          </div>
        </div>
        <div className="bg-home3  space-y-2 bg-cover  flex-col flex justify-center items-center  h-screen ">
          <div className="bg-black/40 p-10 rounded-xl  flex flex-col items-center justify-center text-center w-full h-full ">
            <h1 className="text-white font-sans text-[45px] font-bold">Groceries Delivered in 90 Minute</h1>
            <h3 className="text-slate-100 text-[15px] font-semibold">Get your healthy foods & snacks delivered at your doorsteps all day everyday</h3>
            <a href="#FilterCard"><div className="px-6 w-max py-2 bg-indigo-500 mt-4 text-white drop-shadow-lg rounded-md">Go Shopping ...</div></a>
          </div>
        </div>
      </Swiper> */}
      <Slider>
        {/* <div className="space-y-2 w-full   flex-col flex justify-center items-center  h-screen ">
          <Image alt="aa" src={"/home.jpg"} width={1000000} height={1000000} sizes="100vw" className="w-full h-full" priority />
        </div>
        <div className="space-y-2  w-full flex-col flex justify-center items-center  h-screen ">
          <Image alt="aa" src={"/home3.jpg"} width={1000000} height={1000000} sizes="100vw" className="w-full h-full" priority />
        </div> */}
        <div className="bg-home  space-y-2 bg-cover  flex-col flex justify-center items-center  h-screen ">
          <div className="bg-gradient-to-t  from-black/70 via-black/50 to-transparent left-0 w-full h-3/4 md:h-2/3 lg:h-2/3 absolute bottom-0 py-24  flex flex-col  items-center   text-center  ">
            <div className="w-3/4">
              <h1 className="text-white font-sans text-[45px] font-bold">Groceries Delivered in 90 Minute</h1>
              <h3 className="text-slate-100 text-[15px] font-semibold">Get your healthy foods & snacks delivered at your doorsteps all day everyday</h3>
            </div>
          </div>
        </div>
        {/* <div className="bg-home2  space-y-2 bg-cover  flex-col flex justify-center items-center  h-screen ">
          <div className="bg-gradient-to-t  from-black/70 via-black/50 to-transparent left-0 w-full h-3/4 md:h-2/3 lg:h-2/3 absolute bottom-0 py-24  flex flex-col  items-center   text-center  ">
            <div className="w-3/4">
              <h1 className="text-white font-sans text-[45px] font-bold">Groceries Delivered in 90 Minute</h1>
              <h3 className="text-slate-100 text-[15px] font-semibold">Get your healthy foods & snacks delivered at your doorsteps all day everyday</h3>
            </div>
          </div>
        </div> */}
        <div className="bg-home3  space-y-2 bg-cover  flex-col flex justify-center items-center  h-screen ">
          <div className="bg-gradient-to-t  from-black/70 via-black/50 to-transparent left-0 w-full h-3/4 md:h-2/3 lg:h-2/3 absolute bottom-0 py-24  flex flex-col  items-center   text-center  ">
            <div className="w-3/4">
              <h1 className="text-white font-sans text-[45px] font-bold">Groceries Delivered in 90 Minute</h1>
              <h3 className="text-slate-100 text-[15px] font-semibold">Get your healthy foods & snacks delivered at your doorsteps all day everyday</h3>
            </div>
          </div>
        </div>
      </Slider>

      <div onClick={goshopping} className="absolute bottom-[100px] md:bottom-[150px] lg:bottom-[150px] right-1/2 translate-x-1/2   z-20">
        <div className="px-6 w-max py-2 bg-indigo-500 mt-4 text-white drop-shadow-lg rounded-md">Go Shopping ...</div>
      </div>
    </div>
  );
}

export default BannersCard;
