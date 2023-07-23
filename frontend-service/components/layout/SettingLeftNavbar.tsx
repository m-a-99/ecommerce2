import Link from "next/link";
import { useRouter } from "next/router";


const SettingLeftNavbar = () => {
  const { route } = useRouter();
  return (
    <div className="h-full overflow-auto w-full text-gray-600 p-5">
      <Link href="/profile">
        <div className={`flex h-12 my-2 ${route !== "/profile" ? "hover:text-indigo-500 " : ""} `}>
          <div className={`w-[5px] h-full ${route === "/profile" ? "bg-indigo-500" : ""}`}></div>
          <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out  h-12   items-center flex p-4`}>
            <i className="fa-regular fa-user"></i>
            <span>Profile</span>
          </div>
        </div>
      </Link>

      <Link href="/change-password">
        <div className={`flex h-12 my-2 ${route !== "/change-password" ? "hover:text-indigo-500 " : ""}`}>
          <div className={`w-[5px] h-full ${route === "/change-password" ? "bg-indigo-500" : ""}`}></div>
          <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out   h-12   items-center flex p-4`}>
            <i className="far fa-shop"></i>
            <span>Change Password</span>
          </div>
        </div>
      </Link>

      <Link href="/orders">
        <div className={`flex h-12 my-2 ${route !== "/orders" ? "hover:text-indigo-500 " : ""}`}>
          <div className={`w-[5px] h-full ${route === "/orders" ? "bg-indigo-500" : ""}`}></div>
          <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out  h-12   items-center flex p-4`}>
            <i className="far fa-bring-front"></i>
            <span>My Orders</span>
          </div>
        </div>
      </Link>
      <Link href="/wishlist">
        <div className={`flex h-12 my-2 ${route !== "/wishlist" ? "hover:text-indigo-500 " : ""}`}>
          <div className={`w-[5px] h-full ${route === "/wishlist" ? "bg-indigo-500" : ""}`}></div>
          <div className={`space-x-2 cursor-pointer select-none transition  ease-in-out  h-12   items-center flex p-4`}>
            <i className="fa-regular fa-heart"></i>
            <span>My Wishlist</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SettingLeftNavbar;
