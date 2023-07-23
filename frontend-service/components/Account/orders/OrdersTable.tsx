import { useState } from "react";
import { OrdersType } from "../../../types/OrdersType";
import Table from "../../lib/Table";
import Link from "next/link";

type props = {
  Orders: OrdersType[]
};
function OrdersTable({ Orders }: props) {
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-clip shadow-sm border bg-gray-200/60">
        <Table
          Schema={["Tracking Number", "Delivery Fee", "Total", "Order Date", "Status", "Shipping Address", "Actions"]}
          List={Orders.map((v) => {
            return {
              "Tracking Number": v._id,
              "Delivery Fee": 0,
              Total: v.Amount,
              "Order Date": new Date(v.createdAt).toUTCString(),
              Status: v.Status,
              "Shipping Address": "aaa",
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`orders/${v._id}`}>
                      <div className="cursor-pointer hover:text-indigo-500  text-zinc-600 select-none  flex justify-center">
                        <i className="far fa-pen-to-square"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
}

export default OrdersTable;
