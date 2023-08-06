import { OrderStatusType } from "../../../../../../types/OrderStatusType";
import { OrdersType } from "../../../../../../types/OrdersType";

type props = {
  OrderStatus: OrderStatusType[];
  Order: OrdersType;
};
const ProgressBar = ({Order,OrderStatus}:props) => {
  return (
    <div className="p-5 flex h-[150px] gap-5 items-center">
      <div className="flex  overflow-x-auto customscrollbar py-5">
        {OrderStatus.map((status, index) => {
          if (index === 0) {
            return (
              <div key={status._id} className="space-y-4 flex flex-col items-center">
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
                <div key={status._id} className="space-y-4 flex flex-col items-center">
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
                <div key={status._id} className="space-y-4 flex flex-col items-center">
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
              if (status.Serial < Order.Status.Serial) {
                return (
                  <div key={status._id} className="space-y-4 flex flex-col items-center">
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
                  <div key={status._id} className="space-y-4 flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="w-[60px] h-[4px] bg-indigo-500"></div>
                      <div className="  text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full p-[1px]">
                        <div className={`w-full h-full border-2 ${Order.Status.Type === "Fail" ? "border-red-400 text-red-500" : "border-indigo-500"}   rounded-full flex justify-center items-center `}>{Order.Status.Serial}</div>
                      </div>
                      <div className="w-[60px] h-[4px]  bg-gray-200"></div>
                    </div>
                    <div className="font-semibold text-zinc-700 text-center">{Order.Status.Name}</div>
                  </div>
                );
              } else {
                return (
                  <div key={status._id} className="space-y-4 flex flex-col items-center">
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
    </div>
  );
};

export default ProgressBar;
