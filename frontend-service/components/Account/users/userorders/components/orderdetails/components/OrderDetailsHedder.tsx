import { useEffect, useState } from "react";
import { OrdersType } from "../../../../../../../types/OrdersType";

type props = {
  order: OrdersType;
};

const OrderDetailsHedder = ({ order }: props) => {
  const [date, setdate] = useState("");
  useEffect(() => {
    order?.createdAt&&setdate(new Date(order?.createdAt).toLocaleString("EN-GB", { hour12: true }));
  }, []);
  return (
    <div className="p-5 py-10 items-start bg-white  flex justify-between border-b-[1px] border-gray-300  ">
      <div>
        <div className="text-lg text-zinc-700 font-semibold">Order Details - {order?._id}</div>
        <div className="text-gray-500 ">{date}</div>
      </div>
      <div className="flex  justify-center items-center text-indigo-500 font-semibold space-x-1">
        <i className="far fa-eye"></i>
        <span>Details</span>
      </div>
    </div>
  );
};

export default OrderDetailsHedder;
