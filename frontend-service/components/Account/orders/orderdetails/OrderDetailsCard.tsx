import { useEffect, useState } from "react";
import ItemsList from "./components/ItemsList";
import OrderAddressAndDetails from "./components/OrderAddressAndDetails";
import OrderDetailsHedder from "./components/OrderDetailsHedder";
import ProgressBar from "./components/ProgressBar";
import { useAppSelector } from "../../../../Redux/hooks";
import { OrdersType } from "../../../../types/OrdersType";

type props = {
  order_details_id:null| string;
};
const OrderDetailsCard = ({ order_details_id }: props) => {
  const orders=useAppSelector(state=>state.orders.value)
  const [order, setorder] = useState<OrdersType>(Object.values(orders)[0]);
  useEffect(() => {
    if(order_details_id){
      setorder(orders[order_details_id]);
    }
  }, [order_details_id]);

  return (
    <div className="w-full overflow-auto customscrollbar  h-full bg-white drop-shadow-lg">
      <OrderDetailsHedder order={order} />
      <OrderAddressAndDetails order={order} />
      <ProgressBar />
      <ItemsList order={order} />
    </div>
  );
};

export default OrderDetailsCard;
