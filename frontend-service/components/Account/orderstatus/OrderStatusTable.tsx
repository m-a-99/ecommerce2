import { useEffect, useRef, useState } from "react";
import Table from "../../lib/Table";
import Link from "next/link";
import { OrderStatusType } from "../../../types/OrderStatusType";
import usePutFetch from "../../../custom_hooks/usePutFetch";
import useDeleteFetch from "../../../custom_hooks/useDeleteFetch";
import { useRouter } from "next/router";
import ConfDelete from "../../lib/ConfDelete";
import Spinner from "../../lib/Spinner";

type props = {
  OrderStatus: OrderStatusType[];
};
function OrderStatusTable({ OrderStatus }: props) {
  const [Schema, setSchema] = useState(["ID", "Name", "Serial", "Type", "Role", "Actions"]);
  const { Delete, IsPending, data, err } = useDeleteFetch();
  const IdToDelete = useRef("");

  const [OrderStatusState, setOrderStatusState] = useState(OrderStatus);
  useEffect(() => {
    if (OrderStatus) {
      setOrderStatusState(OrderStatus);
    }
  }, [OrderStatus]);
  const [ShowDeleteConf, setShowDeleteConf] = useState(false);

  function FrieDelete(id: string) {
    IdToDelete.current = id;
    setShowDeleteConf(true);
  }

  function deleteOrderStatus() {
    Delete("/shopping-service/orderstatus/" + IdToDelete.current, "");
    setShowDeleteConf(false);
  }

  useEffect(() => {
    if (data) {
      setOrderStatusState((v) => {
        let tmp = [...v];
        tmp = tmp.filter((o) => o._id !== IdToDelete.current);
        return tmp;
      });
    }
  }, [data]);
  return (
    <div className="relative h-min w-full shadow-md rounded-md ">
      {IsPending && <Spinner />}

      {ShowDeleteConf && <ConfDelete Delete={deleteOrderStatus} Cancel={() => setShowDeleteConf(false)} />}

      <div className=" rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          List={OrderStatusState.map((v) => {
            return {
              ID: v._id,
              Name: v.Name,
              Serial: v.Serial,
              Type: v.Type,
              Role: v.Role,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`orderstatus/edit/${v._id}`}>
                      <div className="cursor-pointer hover:text-indigo-500  text-zinc-600 select-none  flex justify-center">
                        <i className="far fa-pen-to-square"></i>
                      </div>
                    </Link>
                  </div>
                  <div className="w-full">
                    <div onClick={() => FrieDelete(v._id)} className="cursor-pointer hover:text-indigo-500  text-zinc-600 select-none  flex justify-center">
                      <i className="far fa-trash-can"></i>
                    </div>
                  </div>
                </div>
              ),
            };
          })}
          Schema={Schema}
        />
      </div>
    </div>
  );
}

export default OrderStatusTable;
