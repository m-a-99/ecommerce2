import { GetServerSideProps } from "next";
import { FetchProducts } from "../../Redux/products";
import { store } from "../../Redux/store";
import { FetchUserInfo } from "../../Redux/userInfo";
import NavList from "../../components/Account/NavList";
import Headder from "../../components/layout/headder";
import { ParseCookies } from "../../utils/ParseCookies";
export  const getServerSideProps:GetServerSideProps= async (context)=> {
  // const res = await fetch("http://nginx-proxy/shops-service/manufacturers");
  // const Manufacturers = await res.json();
  const cookies = ParseCookies(context.req.headers.cookie||"");
  const [] = await Promise.all([store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      InitialState: store.getState(),
    },
  };
}

const Account = () => {
  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-62px)]">
          <NavList />
        </div>
        <div className="  w-[calc(100%-260px)] flex justify-between"></div>
      </div>
    </div>
  );
};

export default Account;
