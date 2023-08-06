import { GetServerSideProps } from "next";
import IconsHeadder from "../../../components/Account/icons/IconsHeadder"
import IconsTable from "../../../components/Account/icons/IconsTable"
import NavList from "../../../components/Account/NavList"
import Headder from "../../../components/layout/headder"
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { ParseCookies } from "../../../utils/ParseCookies";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [Icons] = await Promise.all([(await fetch("http://nginx-proxy/admin-service/icons")).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      Icons,
      InitialState: store.getState(),
    },
  };
};

function index({Icons}:any) {
     return (
       <div>
         <Headder />
         <div className="flex  mt-[60px]">
           <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
             <NavList />
           </div>
           <div className="w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
             <IconsHeadder />
             <IconsTable Icons={Icons} />
           </div>
         </div>
       </div>
     );
}

export default index