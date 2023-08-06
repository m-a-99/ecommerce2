import { GetServerSideProps } from "next";
import CategoriesHeadder from "../../../components/Account/categories/CategoriesHeadder";
import CategoriesTable from "../../../components/Account/categories/CategoriesTable";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import { ParseCookies } from "../../../utils/ParseCookies";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [Categories] = await Promise.all([(await fetch("http://nginx-proxy/admin-service/categories")).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      Categories,
      InitialState: store.getState(),
    },
  };
};
const categories = ({ Categories }: any) => {
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="  w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <CategoriesHeadder />
          <CategoriesTable Categories={Categories} />
        </div>
      </div>
    </div>
  );
};

export default categories;
