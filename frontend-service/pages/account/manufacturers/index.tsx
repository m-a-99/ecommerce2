import { GetServerSideProps } from "next";
import ManufacturersHeadder from "../../../components/Account/manufacturer/ManufacturersHeadder";
import ManufacturersTable from "../../../components/Account/manufacturer/ManufacturersTable";
import NavList from "../../../components/Account/NavList"
import Headder from "../../../components/layout/headder"
import { ParseCookies } from "../../../utils/ParseCookies";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [Manufacturers] = await Promise.all([(await fetch("http://nginx-proxy/shops-service/manufacturers")).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      Manufacturers,
      InitialState: store.getState(),
    },
  };
};

function index({ Manufacturers }: any) {
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <ManufacturersHeadder />
          <ManufacturersTable Manufacturers={Manufacturers} />
        </div>
      </div>
    </div>
  );
}

export default index