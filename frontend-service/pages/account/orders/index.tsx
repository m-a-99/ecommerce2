import React, { useState } from "react";
import Headder from "../../../components/layout/headder";
import NavList from "../../../components/Account/NavList";
import OrdersHeadder from "../../../components/Account/orders/OrdersHeadder";
import OrdersTable from "../../../components/Account/orders/OrdersTable";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import { FetchOrdersPage } from "../../../Redux/orders";
import { useAppSelector } from "../../../Redux/hooks";
import Pagination from "../../../components/lib/Pagination";
import { useRouter } from "next/router";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const pg = context?.query?.page;
  
  const page = Number.parseInt((pg as string) || "1");
  if (!pg||page<1) {
    return {
      redirect: {
        destination: "/account/orders?page=1",
        permanent: true,
      },
    };
  }
  await Promise.all([store.dispatch(FetchUserInfo(cookies["jwt"] || "")), store.dispatch(FetchOrdersPage({ token: cookies["jwt"] || "", page }))]);
  const orderspage=store.getState().orders.page
  if(orderspage!==page){
    return {
      redirect: {
        destination: "/account/orders?page="+orderspage,
        permanent: true,
      },
    };
  }
  if (!["Admin","Seller"].includes(store.getState().userInfo.value?.AccountType||"")) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {
      InitialState: store.getState(),
    },
  };
};
function index() {
  const { count, hasNext, page, value, pages } = useAppSelector((state) => state.orders);
  console.log(count, hasNext, page, value, pages);
  // const [page,setpage]=useState()
  // const cookies=new Cookies();

  //   const dispatch=useAppDispatch()
  //   function setPage(fun:(v:number)=>number){
  //     dispatch(FetchOrdersPage({ token: cookies.get("jwt"),page:fun(page)}));
  //   }
  function setPage(fun: (v: number) => number) {
    router.push("/account/orders?page=" + fun(page));
  }
  const router = useRouter();
  return (
    <div>
      <Headder />
      <div className="flex   mt-[60px] ">
        <div className="w-[260px] h-[calc(100vh-60px)]  top-[60px] sticky">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <OrdersHeadder />
          <OrdersTable Orders={Object.values(value)} />
          <Pagination HasNext={hasNext} Page={page} Pages={pages} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}

export default index;
