import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingLeftNavbar from "../../components/layout/SettingLeftNavbar";
import MyOrdersCard from "../../components/Setting/myorders/MyOrdersCard";
import Headder from "../../components/layout/headder";
import { store } from "../../Redux/store";
import { ParseCookies } from "../../utils/ParseCookies";
import { FetchCart } from "../../Redux/cart";
import { FetchUserInfo } from "../../Redux/userInfo";
import { FetchOrders } from "../../Redux/orders";
import SettingBottomNavbar from "../../components/layout/SettingBottomNavbar";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
 if (["Admin", "Seller"].includes(store.getState().userInfo.value?.AccountType || "")) {
   return {
     redirect: {
       permanent: true,
       destination: "/account",
     },
   };
 }
  const resData = await Promise.all([store.dispatch(FetchCart(cookies["jwt"] || "")),store.dispatch(FetchOrders(cookies["jwt"]))]);
  return {
    props: {
      InitialState: store.getState(),
    },
  };
};

const MyOrders = ({ InitialState }: any) => {
  const navto = useRouter().push;
  useEffect(() => {
    if (!InitialState.userInfo.loading && InitialState.userInfo.error) {
      navto("/signup");
    }
  }, []);

  return (
    <>
      {!InitialState.userInfo.loading && !InitialState.userInfo.error && (
        <div className="relative">
          <Headder showLogOut={true} />
          <div className="flex w-full h-screen">
            <div className="hidden md:block lg:block w-[260px] h-[calc(100vh-62px)] sticky top-[62px]">
              <SettingLeftNavbar />
            </div>
            <div className="bg-gray-100 h-full w-[calc(100%-260px)] px-10 py-10 mt-10">
              <MyOrdersCard />
            </div>
          </div>
          <div className="md:hidden lg:hidden w-full fixed bottom-0">
            <SettingBottomNavbar />
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
