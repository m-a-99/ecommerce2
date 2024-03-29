import { useState } from "react";
import OrderDetailsCard from "./components/orderdetails/OrderDetailsCard";
import OrdersList from "./components/orderlist/OrdersList";
import { useAppSelector } from "../../../Redux/hooks";
import { OrderStatusType } from "../../../types/OrderStatusType";

type props = { OrderStatus: OrderStatusType[] };
const MyOrdersCard = ({ OrderStatus }:props) => {
  const [order_details_id, setorder_details_id] = useState<null | string>(null);

  return (
    <div className="space-y-10 h-full w-full ">
      <div className="flex gap-10 h-full w-full ">
        <div className="w-[35%]">
          <OrdersList setorder_details_id={setorder_details_id} />
        </div>
        <div className="w-[65%]">
          <OrderDetailsCard OrderStatus={OrderStatus} order_details_id={order_details_id} />
        </div>
      </div>
    </div>
  );
};

export default MyOrdersCard;
