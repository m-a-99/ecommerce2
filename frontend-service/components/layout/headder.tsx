import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "../../Redux/hooks";
import Cart from "../Home/cart/Cart";
import Cookies, {Cookie} from "universal-cookie"
import { useRouter } from "next/router";

const Headder = ({showLogOut=true}:{showLogOut?:boolean}) => {
 const userInfo=useAppSelector(state=>state.userInfo)
  const cookie=new Cookies();
  const router=useRouter()
  return (
    <div className="fixed  drop-shadow-sm top-0 z-30 bg-white py-[10px]  items-center w-full  flex justify-between space-x-4">
      <div className="flex space-x-10 px-4">
        <Link href={"/"}>
          <div>
            <Image src={"/olivia3.png"} alt="logo" width={0} height={0} sizes="100vw" className=" w-[75px]" />
          </div>
        </Link>
        <div className="hidden lg:flex md:flex  space-x-5 text-gray-600">
          <div className="">Catigories</div>
          <div className="">Shops</div>
          <div className="">Contacts</div>
          <div className="">Offers</div>
        </div>
      </div>

      <div className="flex space-x-2 justify-center px-4 md:px-4 lg:px-6">
        {!["Admin","Seller"].includes(userInfo.value.AccountType||"")&&<div className="border-r-2 pr-5">
          <Cart />
        </div>}
        {!userInfo.loading && userInfo.error ? (
          <Link href="/signup">
            <div className="bg-indigo-500 text-slate-50 font-medium px-6 py-2">Signup</div>
          </Link>
        ) : (
          <>
            <Link href="/profile">
              <div>
                {!userInfo.loading && !userInfo.error && userInfo.value.Img ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex justify-center drop-shadow-lg">
                    <Image alt="profile" width={50} height={50} src={"http://nginx-proxy" + userInfo.value.Img} className="object-cover"  />
                  </div>
                ) : (
                  <div className="text-xl text-indigo-500 border-2 shadow-lg bg-white w-10 h-10 rounded-full flex justify-center items-center">
                    <i className="fas fa-user-tie"></i>
                  </div>
                )}
              </div>
            </Link>
            {showLogOut && (
              <Link onClick={() => cookie.remove("jwt")} href={"/signup"}>
                <div className="w-10 hover:text-lg hover:bg-gray-100 cursor-pointer  h-10 flex justify-center items-center rounded-full text-gray-600 drop-shadow-md border border-gray-200">
                  <i className=" far fa-right-from-bracket"></i>
                </div>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Headder;
