import { useState } from "react";
import OrderCard from "./components/OrderCard";
import { useAppDispatch, useAppSelector } from "../../../../../Redux/hooks";
import { FetchMoreOrders } from "../../../../../Redux/orders";
import Cookies from "universal-cookie"
type props = {
  
setorder_details_id :(id:string)=>void;
};
const OrdersList = ({setorder_details_id }: props) => {
  const orders = useAppSelector((state) => Object.values(state.orders.value));
  const count = useAppSelector((state) => state.orders.count);
  const cookies = new Cookies();
  const hasnext = useAppSelector((state) => state.orders.hasNext);
  const dispatch = useAppDispatch();
  function LoadMore() {
    dispatch(FetchMoreOrders(cookies.get("jwt")));
  }
  return (
    <div className="w-full bg-white h-full drop-shadow-md p-5 space-y-5 ">
      <h1 className="text-zinc-700 font-semibold   text-lg  ">My Orders</h1>
      <div className="space-y-4 overflow-y-auto h-[calc(100%-60px)] customscrollbar p-4 ">
        {orders.map((order, index) => (
          <div onClick={() => setorder_details_id(order._id)} key={order._id}>
            <OrderCard order={order} index={count - index} />
          </div>
        ))}
        <div className="flex  w-full mt-5 justify-center items-center ">
          {hasnext ? (
            <div onClick={LoadMore} className="px-4 py-2 bg-indigo-500 rounded-md text-white cursor-pointer select-none">
              Load More
            </div>
          ) : (
            <div className="px-4 py-2 bg-indigo-300 rounded-md text-white  select-none">Load More</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
