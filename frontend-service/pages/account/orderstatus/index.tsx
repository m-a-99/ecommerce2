import React, { useState } from "react";
import Headder from "../../../components/layout/headder";
import NavList from "../../../components/Account/NavList";
import OrderStatusHeadder from "../../../components/Account/orderstatus/OrderStatusHeadder";
import { GetServerSideProps } from "next";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { ParseCookies } from "../../../utils/ParseCookies";
import { OrderStatusType } from "../../../types/OrderStatusType";
import OrderStatusTable from "../../../components/Account/orderstatus/OrderStatusTable";
import Pagination from "../../../components/lib/Pagination";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const pg = context?.query?.page;
  const role = context?.query?.role;
  await store.dispatch(FetchUserInfo(cookies["jwt"]));
  if (store.getState().userInfo.value.AccountType !== "Admin") {
    return {
      notFound: true,
    };
  }

  let page = Number.parseInt((pg as string) || "1");
  page = page < 1 ? 1 : page;
  const Role = ["Admin", "Seller"].includes("" + role) ? "" + role : "Admin";

  if ("" + pg !== "" + page || "" + role !== "" + Role) {
    return {
      redirect: {
        destination: `/account/orderstatus?page=${page}&role=${Role}`,
        permanent: true,
      },
    };
  }

  const [OrderStatus]: any = await Promise.all([await fetch(`http://nginx-proxy/shopping-service/orderstatus?page=${page}&role=${Role}`, { headers: { Authorization: cookies["jwt"] } }).then((res) => res.json())]);
  if (OrderStatus.Page !== page) {
    return {
      redirect: {
        destination: `/account/orderstatus?page=${OrderStatus.Page}&role=${Role}`,
        permanent: true,
      },
    };
  }
  return {
    props: {
      InitialState: store.getState(),
      OrderStatus,
    },
  };
};

function index({ OrderStatus }: { OrderStatus: { Count: number; HasNext: boolean; Page: number; Data: OrderStatusType[]; Pages: number } }) {
  const router = useRouter();

  function setPage(fun: (v: number) => number) {
    router.push(`/account/orderstatus?page=${fun(OrderStatus.Page)}&role=${router.query.role}`);
  }
  function setRole(Role: string) {
    router.push(`/account/orderstatus?page=${router.query.page}&role=${Role}`);
  }
  return (
    <div>
      <Headder />
      <div className="flex mt-[60px] ">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)]  bg-gray-100   justify-between p-8 space-y-10">
          <OrderStatusHeadder Role={router.query.role as string} setRole={setRole} />
          <OrderStatusTable OrderStatus={OrderStatus.Data} />
          <Pagination HasNext={OrderStatus.HasNext} Page={OrderStatus.Page} Pages={OrderStatus.Pages} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}

export default index;
