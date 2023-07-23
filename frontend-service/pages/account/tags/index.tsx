import { GetServerSideProps } from "next";
import { store } from "../../../Redux/store";
import NavList from "../../../components/Account/NavList";
import TagsHeadder from "../../../components/Account/tags/TagsHeadder";
import TagsTable from "../../../components/Account/tags/TagsTable";
import Headder from "../../../components/layout/headder";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";


export const getServerSideProps: GetServerSideProps = async (context) => {
  // const res = await fetch("http://nginx-proxy/shops-service/manufacturers");
  // const Manufacturers = await res.json();
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [Tags] = await Promise.all([(await fetch("http://nginx-proxy/admin-service/tags")).json(),store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      Tags,
      InitialState: store.getState(),
    },
  };
};

const Tags = ({ Tags }: any) => {
  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className=" w-full bg-gray-100   justify-between p-8 space-y-10">
          <TagsHeadder />
          <TagsTable Tags={Tags} />
        </div>
      </div>
    </div>
  );
};

export default Tags;
