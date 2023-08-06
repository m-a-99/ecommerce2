import { useEffect, useState } from "react";
import ItemsList from "./components/ItemsList";
import OrderAddressAndDetails from "./components/OrderAddressAndDetails";
import OrderDetailsHedder from "./components/OrderDetailsHedder";
import ProgressBar from "./components/ProgressBar";
import { OrdersType } from "../../../../../types/OrdersType";
import { useAppSelector } from "../../../../../Redux/hooks";
import { OrderStatusType } from "../../../../../types/OrderStatusType";
type props = {
  order_details_id: null | string;
  OrderStatus: OrderStatusType[];
};
const OrderDetailsCard = ({ order_details_id, OrderStatus }: props) => {
  const orders = useAppSelector((state) => state.orders.value);
  const [order, setorder] = useState<OrdersType>(Object.values(orders)[0]);
  useEffect(() => {
    if (order_details_id) {
      setorder(orders[order_details_id]);
    }
  }, [order_details_id]);

  return (
    <div className="w-full overflow-auto customscrollbar  h-full bg-white drop-shadow-lg">
      <OrderDetailsHedder order={order} />
      <OrderAddressAndDetails order={order} />
      <ProgressBar Order={order} OrderStatus={OrderStatus} />
      <ItemsList order={order} />
    </div>
  );
};

export default OrderDetailsCard;
