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
  const [Order] = await Promise.all([await fetch("http://nginx-proxy/shopping-service/orders/" + id, { headers: { Authorization: cookies["jwt"] || "" } }).then((res) => res.json())]);
  return {
    props: {
      Order,
      InitialState: store.getState(),
    },
  };
};

const MyOrdersCard = ({ Order }: { Order: OrdersType }) => {
  console.log(Order)
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <OrderDetailsHedder order={Order} />

          <div className="bg-white">
            <OrderAddressAndDetails order={Order} />
            <ProgressBar />
          </div>
          <ItemsList order={Order} />
        </div>
      </div>
    </div>
  );
};

export default MyOrdersCard;
