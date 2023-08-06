import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { OrderStatusType } from "../../../../../types/OrderStatusType";
import DropList from "../../../../lib/DropList";
import { OrdersType } from "../../../../../types/OrdersType";
import usePutFetch from "../../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";
import Spinner from "../../../../lib/Spinner";
type props = {
  OrderStatus: OrderStatusType[];
  setOrder: Dispatch<SetStateAction<OrdersType>>;
  Order: OrdersType;
};
const ProgressBar = ({ OrderStatus, Order, setOrder }: props) => {
  const [StatusId, setStatusId] = useState(Order.Status._id);
  const [SaveEn, setSaveEn] = useState(false);
  const router = useRouter();

  const { IsPending, data, err, put } = usePutFetch();

  function save() {
    const id = router?.query?.id || "";
    put("/shopping-service/orders/status/" + id, JSON.stringify({ StatusId }));
  }

  useEffect(() => {
    if (data && data?.Status) {
      const status = OrderStatus.find((v) => v._id === data.Status);
      if (status) {
        setOrder((v) => ({ ...v, Status: status }));
      }
    }
  }, [data]);

  useEffect(() => {
    let en = false;
    if (StatusId !== Order.Status._id) {
      en = true;
    }
    setSaveEn(en);
  }, [StatusId, Order]);
  return (
    <div className="p-5 flex h-[150px] gap-5 items-center">
      <div className="flex  overflow-x-auto customscrollbar py-5">
        {OrderStatus.map((status, index) => {
          if (index === 0) {
            return (
              <div className="space-y-4 flex flex-col items-center">
                <div className="flex items-center">
                  <div className="w-[60px] h-[4px] invisible bg-indigo-500"></div>
                  <div className=" flex justify-center text-white items-center w-9 h-9 bg-indigo-500 rounded-full">
                    <i className="fa-regular fa-check"></i>
                  </div>
                  <div className="w-[60px] h-[4px]  bg-indigo-500"></div>
                </div>
                <div className="font-semibold text-zinc-700 text-center">{status.Name}</div>
              </div>
            );
          } else if (index === OrderStatus.length - 1) {
            if (status.Serial === Order.Status.Serial) {
              return (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-[60px] h-[4px] bg-indigo-500"></div>
                    <div className=" flex justify-center text-white items-center w-9 h-9 bg-indigo-500 rounded-full">
                      <i className="fa-regular fa-check"></i>
                    </div>
                    <div className="w-[60px] h-[4px]  bg-gray-200 invisible"></div>
                  </div>
                  <div className="font-semibold text-zinc-700 text-center">{status.Name}</div>
                </div>
              );
            } else {
              return (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-[60px] h-[4px] bg-gray-200"></div>
                    <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">{status.Serial}</div>
                    <div className="w-[60px] h-[4px]  bg-gray-200 invisible"></div>
                  </div>
                  <div className="font-semibold text-zinc-700 text-center">{status.Name}</div>
                </div>
              );
            }
          } else {
            if (status.Type !== "Fail") {
              console.log(status)
              if (status.Serial < Order.Status.Serial) {
                return (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="w-[60px] h-[4px] bg-indigo-500"></div>
                      <div className=" flex justify-center text-white items-center w-9 h-9 bg-indigo-500 rounded-full">
                        <i className="fa-regular fa-check"></i>
                      </div>
                      <div className="w-[60px] h-[4px]  bg-indigo-500"></div>
                    </div>
                    <div className="font-semibold text-zinc-700 text-center">{status.Name}</div>
                  </div>
                );
              } else if (status.Serial === Order.Status.Serial) {
                return (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="w-[60px] h-[4px] bg-indigo-500"></div>
                      <div className="  text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full p-[1px]">
                        <div className={`w-full h-full border-2 ${Order.Status.Type==="Fail"?"border-red-400 text-red-500":"border-indigo-500"}   rounded-full flex justify-center items-center `}>{Order.Status.Serial}</div>
                      </div>
                      <div className="w-[60px] h-[4px]  bg-gray-200"></div>
                    </div>
                    <div className="font-semibold text-zinc-700 text-center">{Order.Status.Name}</div>
                  </div>
                );
              } else {
                return (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="w-[60px] h-[4px]  bg-gray-200"></div>
                      <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">{status.Serial}</div>
                      <div className="w-[60px] h-[4px]  bg-gray-200"></div>
                    </div>
                    <div className="font-semibold text-zinc-700 text-center">{status.Name}</div>
                  </div>
                );
              }
            }
          }
        })}
      </div>
      <div className="w-[2px] h-full border border-gray-300"></div>
      <div className="relative flex flex-col items-center gap-5 p-5">
        {IsPending && <Spinner />}
        <div className="w-[180px]">
          <DropList List={OrderStatus.map((v) => ({ Id: v._id, Name: v.Name }))} Value={StatusId} setValue={setStatusId} />
        </div>
        <div>
          {SaveEn ? (
            <div onClick={save} className="flex justify-end">
              <div className="w-[60px] h-[35px] flex items-center justify-center cursor-pointer select-none rounded-md bg-indigo-500 text-white">Save</div>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="w-[60px] h-[35px] flex items-center justify-center  select-none rounded-md bg-indigo-300 text-white">Save</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
