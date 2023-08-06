import { GetServerSideProps } from "next";
import NavList from "../../../components/Account/NavList";
import SocialMediaPlatformsHeadder from "../../../components/Account/socialmediaplatforms/SocialMediaPlatformsHeadder";
import SocialMediaPlatformsTable from "../../../components/Account/socialmediaplatforms/SocialMediaPlatformsTable";
import Headder from "../../../components/layout/headder";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { ParseCookies } from "../../../utils/ParseCookies";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [SocialMediaPlatforms] = await Promise.all([(await fetch("http://nginx-proxy/admin-service/socialmediaplatforms")).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      SocialMediaPlatforms,
      InitialState: store.getState(),
    },
  };
};

function index({ SocialMediaPlatforms }: any) {
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="  w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <SocialMediaPlatformsHeadder />
          <SocialMediaPlatformsTable SocialMediaPlatforms={SocialMediaPlatforms} />
        </div>
      </div>
    </div>
  );
}

export default index;
