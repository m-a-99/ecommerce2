import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import BannersCard from "../components/Home/BannersCard";
import FilterCard from "../components/Home/FilterCard";
import ProductsList from "../components/Home/products/ProductsList";
import Headder from "../components/layout/headder";
import { FetchCart } from "../Redux/cart";
import { FetchUserInfo } from "../Redux/userInfo";
import { ParseCookies } from "../utils/ParseCookies";
import { store } from "../Redux/store";
import { FetchProducts } from "../Redux/products";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  //const resData = await Promise.all([(await fetch("http://nginx-proxy/admin-service/categories")).json(), (await fetch("http://nginx-proxy/products-service/products")).json(), store.dispatch(FetchCart({SessionId:cookies["SessionId"] || "", Token:cookies["jwt"] || ""})), store.dispatch(FetchUserInfo(cookies["jwt"] || ""))]);
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""))
  if(["Admin","Seller"].includes(store.getState().userInfo.value?.AccountType||"") ){
    return {
      redirect: {
        permanent: true,
        destination: "/account",
      },
    };
  }
  const resData = await Promise.all([(await fetch("http://nginx-proxy/admin-service/categories")).json(), store.dispatch(FetchProducts(cookies["jwt"]||"")), store.dispatch(FetchCart(cookies["jwt"] || ""))]);
  return { props: { categories: resData[0],  InitialState: store.getState() } };
};

const Home = ({InitialState, categories, }: any) => {
  console.log(InitialState?.userInfo.value.AccountType, InitialState?.userInfo.value.AccountType === "Client");
  return (
    !["Admin", "SubAdmin", "SubSeller", "Seller"].includes(store.getState().userInfo.value?.AccountType || "") && (
      <div className="min-h-screen">
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Headder />
        <BannersCard />
        <FilterCard categories={categories} />
        <ProductsList />
        <div>
          <div className="flex"></div>
        </div>
      </div>
    )
  );
};

export default Home;
