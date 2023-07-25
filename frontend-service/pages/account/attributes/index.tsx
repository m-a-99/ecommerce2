import { GetServerSideProps } from "next";
import AttributesHeadder from "../../../components/Account/attributes/AttributesHeadder";
import AttributesTable from "../../../components/Account/attributes/AttributesTable";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { ParseCookies } from "../../../utils/ParseCookies";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const [Attributes] = await Promise.all([(await fetch("http://nginx-proxy/shops-service/attributes")).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  return {
    props: {
      Attributes,
      InitialState: store.getState(),
    },
  };
};
function index({ Attributes }: any) {
  console.log(Attributes);
  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className=" w-full bg-gray-100   justify-between p-8 space-y-10">
          <AttributesHeadder />
          <AttributesTable Attributes={Attributes} />
        </div>
      </div>
    </div>
  );
}

export default index;
