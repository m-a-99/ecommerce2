import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Headder from "../../components/layout/headder";
import ProfileCard from "../../components/Setting/profile/ProfileCard";
import SettingLeftNavbar from "../../components/layout/SettingLeftNavbar";
import { FetchCart } from "../../Redux/cart";
import { FetchUserInfo, setUserInfo } from "../../Redux/userInfo";
import { ParseCookies } from "../../utils/ParseCookies";
import { store } from "../../Redux/store";
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
  const resData = await Promise.all([store.dispatch(FetchCart(cookies["jwt"] || ""))]);
  return {
    props: {
      InitialState: store.getState(),
    },
    
  };
};

const Profile = ({ InitialState }:any) => {
  const navto = useRouter().push;
  useEffect(() => {
    if (!InitialState.userInfo.loading && InitialState.userInfo.error) {
      navto("/signup");
    }
  }, []);
  return (
    <div>
      {!InitialState.userInfo.loading && !InitialState.userInfo.error && (
        <div className="relative">
          <Headder showLogOut={true} />

          <div className="flex ">
            <div className="hidden md:block lg:block w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
              <SettingLeftNavbar />
            </div>

            <div className="bg-gray-100 w-full p-10 ">
              <div className=" py-10 lg:px-12 md:px-12">
                <ProfileCard />
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
};

export default Profile;
