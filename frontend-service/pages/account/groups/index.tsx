import { GetServerSideProps } from "next";
import GroupHeadder from "../../../components/Account/groups/GroupHeadder";
import GroupTable from "../../../components/Account/groups/GroupTable";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import { ParseCookies } from "../../../utils/ParseCookies";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [groups] = await Promise.all([(await fetch("http:nginx-proxy/admin-service/groups")).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      groups,
      InitialState: store.getState(),
    },
  };
};

const groups = ({groups}:any) => {
    return (
      <div>
        <Headder />
        <div className="flex  mt-[60px]">
          <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
            <NavList />
          </div>
          <div className="  w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
            <GroupHeadder />
            <GroupTable Groups={groups} />
          </div>
        </div>
      </div>
    );
}
 
export default groups;