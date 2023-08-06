import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Headder from "../../components/layout/headder";
import ChangePasswordCard from "../../components/Setting/changepassword/ChangePasswordCard";
import SettingLeftNavbar from "../../components/layout/SettingLeftNavbar";
import { ParseCookies } from "../../utils/ParseCookies";
import { FetchCart } from "../../Redux/cart";
import { store } from "../../Redux/store";
import { FetchUserInfo } from "../../Redux/userInfo";
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
  const resData = await Promise.all([store.dispatch(FetchCart(cookies["jwt"]||""))]);
  return {
    props: {
      InitialState: store.getState(),
    },
  };
};

const ChangePassword = ({ InitialState }: any) => {
  const navto = useRouter().push;
  useEffect(() => {
    if (!InitialState.userInfo.loading && InitialState.userInfo.error) {
      navto("/signup");
    }
  }, []);

  return (
    <>
      {!InitialState.userInfo.loading && !InitialState.userInfo.error && (
        <div className="relative">
          <Headder showLogOut={true} />
          <div className="flex h-screen">
            <div className="hidden md:block lg:block w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
              <SettingLeftNavbar />
            </div>

            <div className="bg-gray-100  w-full p-10 ">
              <div className=" py-10 lg:px-12 md:px-12 ">
                <ChangePasswordCard />
              </div>
            </div>
          </div>
          <div className="md:hidden lg:hidden w-full fixed bottom-0">
            <SettingBottomNavbar />
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
