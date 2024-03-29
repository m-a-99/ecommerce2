import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import { ShopsType } from "../../../types/ShopsType";
import Headder from "../../../components/layout/headder";
import NavList from "../../../components/Account/NavList";
import CreateShopHeadderCard from "../../../components/Account/shops/create/CreateShopHeadderCard";
import ShopTable from "../../../components/Account/shops/ShopTable";
import ShopHeadder from "../../../components/Account/shops/ShopHeadder";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Seller") {
    return {
      redirect: {
        permanent: true,
        destination: "/account",
      },
    };
  }
    const [shops] = await Promise.all([(await fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } })).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);

  return {
    props: {
      shops,
      InitialState: store.getState(),
    },
  };
};

const myshops = ({ shops }: { shops: ShopsType[] }) => {
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="  w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <ShopHeadder />
          <ShopTable shops={shops} />
        </div>
      </div>
    </div>
  );
};

export default myshops;
