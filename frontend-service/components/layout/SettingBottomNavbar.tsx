import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

function SettingBottomNavbar() {
    const { route } = useRouter();
    return (
      <div className="h-full border  border-gray-300 drop-shadow-lg bg-white flex px-10 sm:px-20 justify-between overflow-auto w-full text-gray-600">
        <Link href="/profile">
          <div className={`text-xl flex flex-col justify-center items-center w-10 h-full  ${route !== "/profile" ? "hover:text-indigo-500 " : "text-indigo-500"} `}>
            <div className={`cursor-pointer select-none transition  ease-in-out  items-cente `}>
              <i className="fa-regular fa-user"></i>
            </div>
          </div>
        </Link>

        <Link href="/change-password">
          <div className={`text-xl flex flex-col justify-center items-center w-10 h-full ${route !== "/change-password" ? "hover:text-indigo-500 " : "hover:text-indigo-500"}`}>
            <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out  items-center flex p-4`}>
              <i className="far fa-shop"></i>
            </div>
          </div>
        </Link>

        <Link href="/orders">
          <div className={` text-xl flex flex-col justify-center items-center w-10 h-full  ${route !== "/orders" ? "hover:text-indigo-500 " : "text-indigo-500"}`}>
            <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out    items-center flex p-4`}>
              <i className="far fa-bring-front"></i>
            </div>
          </div>
        </Link>
        <Link href="/wishlist">
          <div className={`text-xl flex flex-col justify-center items-center w-10 h-full  ${route !== "/wishlist" ? "hover:text-indigo-500 " : "text-indigo-500"}`}>
            <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out    items-center flex p-4`}>
              <i className="fa-regular fa-heart"></i>
            </div>
          </div>
        </Link>
      </div>
    );
  
}

export default SettingBottomNavbar