import { GetServerSideProps } from "next";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import NavList from "../../../components/Account/NavList";
import ItemsList from "../../../components/Account/orders/orderdetails/components/ItemsList";
import OrderAddressAndDetails from "../../../components/Account/orders/orderdetails/components/OrderAddressAndDetails";
import OrderDetailsHedder from "../../../components/Account/orders/orderdetails/components/OrderDetailsHedder";
import ProgressBar from "../../../components/Account/orders/orderdetails/components/ProgressBar";
import Headder from "../../../components/layout/headder";
import { OrdersType } from "../../../types/OrdersType";
import { ParseCookies } from "../../../utils/ParseCookies";
import { useState } from "react";
import { useAppSelector } from "../../../Redux/hooks";
import { OrderStatusType } from "../../../types/OrderStatusType";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (!["Admin","Seller"].includes(store.getState().userInfo.value?.AccountType||"")  ) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }
  const id = context?.params?.id || "";

  const [Order,OrderStatus] = await Promise.all([await fetch("http://nginx-proxy/shopping-service/orders/" + id, { headers: { Authorization: cookies["jwt"] || "" } }).then((res) => res.json()), await fetch("http://nginx-proxy/shopping-service/orderstatus/all", { headers: { Authorization: cookies["jwt"] || "" } }).then((res) => res.json())]);
  return {
    props: {
      Order,
      OrderStatus,
      InitialState: store.getState(),
    },
  };
};

const MyOrdersCard = ({ Order ,OrderStatus }: { Order: OrdersType;OrderStatus:OrderStatusType[] }) => {
  const [OrderState, setOrderState] = useState(Order);
  const userInfo=useAppSelector(state=>state.userInfo.value);
  return (
    <div className="">
      <Headder />
      <div className="flex  mt-[60px] ">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <OrderDetailsHedder order={OrderState} />

          {userInfo.AccountType === "Admin" && (
            <div className="bg-white">
              <OrderAddressAndDetails order={OrderState} />
              <ProgressBar setOrder={setOrderState} Order={OrderState} OrderStatus={OrderStatus} />
            </div>
          )}
          <ItemsList OrderStatus={OrderStatus} OrderState={OrderState} setOrderState={setOrderState} />
        </div>
      </div>
    </div>
  );
};

export default MyOrdersCard;
