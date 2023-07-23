import { OrdersType } from "../../../../../../types/OrdersType";

type props = {
  order: OrdersType;
  index: number;
};
const OrderCard = ({ order, index }: props) => {
  return (
    <div className="bg-gray-100  rounded-md border-2 border-indigo-500 ">
      <div className="p-3 border-b-[1px] border-gray-300 ">
        <h1 className="font-semibold text-zinc-800 text-lg text-ellipsis overflow-hidden whitespace-nowrap">Order #{index}</h1>
      </div>
      <div className="p-3 w-full">
        <div className="flex justify-between text-sm text-zinc-600 ">
          <div className="w-5/12">Order Date</div>
          <div className="w-2/12 text-center">:</div>
          <div className="w-5/12 text-right   ">
            {new Date(order.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              // timeStyle: "long",
            })}
            {/* January 12, 2022 */}
          </div>
        </div>
        <div className="flex w-full justify-between text-sm text-zinc-600    ">
          <div className="w-5/12">Delivery Time</div>
          <div className="w-2/12 text-center">:</div>
          <p className="w-5/12 text-right ">{order.DeliverySchedule}</p>
        </div>
        <div className="flex justify-between  space-x-2">
          <div className="w-5/12">Amount</div>
          <div className="w-2/12 text-center">:</div>
          <div className="text-right w-5/12">${order.Amount}</div>
        </div>
        <div className="flex justify-between space-x-2 ">
          <div className="w-5/12">Total Price</div>
          <div className="w-2/12 text-center">:</div>
          <div className=" w-5/12 text-right">
            ${order.Amount}
            {/* {(order.tax +
              order.delivery_fee +
              order.order_items
                .reduce(
                  (pre, cur) => pre + cur.quantity * cur.product_info.price,
                  0
                )).toFixed(2)} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
