import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import Headder from "../../../components/layout/headder";
import NavList from "../../../components/Account/NavList";
import ShippingsHeadder from "../../../components/Account/shippings/ShippingsHeadder";
import ShippingsTable from "../../../components/Account/shippings/ShippingsTable";
import { ShippingType } from "../../../types/ShippingType";
import Pagination from "../../../components/lib/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Admin") {
    return {
      redirect: {
        permanent: true,
        destination: "/account",
      },
    };
  }
  let page = Number.parseInt(context?.query?.page as string||"1");
  if(page<1){
    return {
      redirect: {
        destination: "shippings?page=1",
        permanent:true,

      },
    };
  }
  const [Shippings] = await Promise.all([(await fetch(`http://nginx-proxy/shopping-service/shippings?page=${page}`, { headers: { Authorization: cookies["jwt"] } })).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  if (Shippings["Page"]!==page){
 return {
   redirect: {
     destination: `shippings?page=${Shippings["Page"]}`,
     permanent: true,
   },
 };
  }
    return {
      props: {
        Shippings,
        InitialState: store.getState(),
      },
    };
};

const myshops = ({ Shippings }: { Shippings: { Data: ShippingType[]; Page: number; HasNext: boolean,Pages:number } }) => {
  const [PageState, setPageState] = useState(Shippings.Page);
  const router = useRouter();
  useEffect(() => {
    if (PageState !== Shippings.Page) {
      router.push(`shippings?page=${PageState}`);
    }
  }, [PageState]);
  
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)] bg-gray-100 justify-between p-8 space-y-10">
          <ShippingsHeadder />
          <ShippingsTable Shippings={Shippings.Data} />
          <Pagination HasNext={Shippings.HasNext} Page={Shippings.Page} setPage={setPageState} Pages={Shippings.Pages} />
        </div>
      </div>
    </div>
  );
};

export default myshops;
