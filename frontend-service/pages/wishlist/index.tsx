import Head from "next/head";
import React from "react";
import Headder from "../../components/layout/headder";
import { GetServerSideProps } from "next";
import { store } from "../../Redux/store";
import { FetchUserInfo } from "../../Redux/userInfo";
import { ParseCookies } from "../../utils/ParseCookies";
import SettingLeftNavbar from "../../components/layout/SettingLeftNavbar";
import SettingBottomNavbar from "../../components/layout/SettingBottomNavbar";
import ProductList from "../../components/Setting/wishList/ProductList";
import { FetchCart } from "../../Redux/cart";
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
  const [wishlist] = await Promise.all([(await fetch("http://nginx-proxy/products-service/wishlist", { headers: { Authorization: cookies["jwt"] || "" } })).json(), store.dispatch(FetchCart(cookies["jwt"] || ""))]);
  return {
    props: {
      wishlist,
      InitialState: store.getState(),
    },
  };
};
function index({ InitialState, wishlist }: any) {
  return (
    <div>
      {!InitialState.userInfo.loading && !InitialState.userInfo.error && (
        <div className="relative ">
          <Headder showLogOut={true} />

          <div className="flex h-screen">
            <div className="hidden md:block lg:block w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
              <SettingLeftNavbar />
            </div>

            <div className="bg-gray-100 w-full p-10 ">
              <div className=" py-10 lg:px-12 md:px-12">
                <ProductList WishList={wishlist} />
              </div>
            </div>
          </div>
          <div className="md:hidden lg:hidden w-full fixed bottom-0">
            <SettingBottomNavbar />
          </div>
        </div>
      )}
    </div>
  );
}

export default index;
