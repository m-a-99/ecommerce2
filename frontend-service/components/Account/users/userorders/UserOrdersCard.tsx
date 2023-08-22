import { useState } from "react";
import OrderDetailsCard from "./components/orderdetails/OrderDetailsCard";
import OrdersList from "./components/orderlist/OrdersList";
import { OrderStatusType } from "../../../../types/OrderStatusType";
import { OrdersType } from "../../../../types/OrdersType";

type props = {
  Orders: PaginationType<OrdersType[]>;
  OrderStatus: OrderStatusType[];
};
const UserOrdersCard = ({ OrderStatus, Orders }: props) => {
  const [order_details_id, setorder_details_id] = useState<null | string>(null);

  return (
    <div className="space-y-10 h-full w-full ">
      <div className="flex gap-10 h-full w-full ">
        <div className="w-[35%]">
          <OrdersList setorder_details_id={setorder_details_id} Orders={Orders} />
        </div>
        <div className="w-[65%]">
          <OrderDetailsCard Orders={Orders} OrderStatus={OrderStatus} order_details_id={order_details_id} />
        </div>
      </div>
    </div>
  );
};

export default UserOrdersCard;
