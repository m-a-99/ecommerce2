import React, { useEffect, useState } from "react";
import DropList from "../../../../../lib/DropList";
import { OrderShop, OrdersType } from "../../../../../../types/OrdersType";
import usePostFetch from "../../../../../../custom_hooks/usePostFetch";
import { useRouter } from "next/router";
import usePutFetch from "../../../../../../custom_hooks/usePutFetch";
import Spinner from "../../../../../lib/Spinner";
import { isPending } from "@reduxjs/toolkit";
type props = {
  Shop: OrderShop;
  setOrderState: (v: OrdersType | ((v: OrdersType) => OrdersType)) => void;
};

const AdminActionCard = ({ Shop, setOrderState }: props) => {
  const [showAdminAction, setshowAdminAction] = useState(false);
  const [ShowMsgLog, setShowMsgLog] = useState(false);
  const [State, setState] = useState(Shop.AdminDeliveryStatus);
  const [Message, setMessage] = useState(Shop.Message);

  const { IsPending, data, err, put } = usePutFetch();
  const router = useRouter();

  const [SaveEn, setSaveEn]=useState(false);

  const { id } = router.query || {};

  function save() {
    const payload: any = {};
    State && (payload.State = State);
    Message && (payload.Message = Message);
    payload.ShopId = Shop.ShopId;
    put("/shopping-service/orders/deliverystate/" + id, JSON.stringify(payload));
  }


  useEffect(() => {
    let en = false;
    if (Shop.Message !== Message || State !== Shop.AdminDeliveryStatus) {
      en = true;
    }
    setSaveEn(en);
  }, [Shop, Message, State]);

  useEffect(() => {
    if(data){
      setOrderState(data)
    }
  }, [data]);

  return (
    <>
      <div>
        <div onClick={() => setshowAdminAction((v) => !v)} className="font-semibold flex justify-center items-center gap-1 m-auto  w-max text-indigo-500 font-mono cursor-pointer hover:text-indigo-600">
          <div>Admin Action</div>
          <i className={`fa-sharp fa-solid fa-caret-${showAdminAction ? "down" : "right"}`}></i>
        </div>
      </div>
      {showAdminAction && (
        <div className="bg-white rounded-md relative border-gray-200 border px-10 w-full text-left">
          {IsPending && <Spinner />}
          <div className="flex justify-between border-b py-10">
            <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
              <p>Order Delivery State</p>
            </div>
            <div className="w-7/12 space-y-3">
              <div className="space-y-1">
                <div className="text-gray-600">Choose State</div>
                <div className="w-full">
                  <DropList List={["Pending", "Rejected", "Approved"].map((state) => ({ Id: state, Name: state }))} Value={State} setValue={setState} />
                </div>
              </div>
              <div>
                <div className="text-gray-600">Massage</div>
                <div className="p-2 rounded-md overflow-hidden border border-gray-400 ">
                  <textarea value={Message} onChange={(e) => setMessage(e.target.value)} className="w-full h-[100px] outline-none   resize-none px-2 py-2 text-gray-600 customscrollbar cursor-auto bg-transparent"></textarea>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-600">
                  <input checked={ShowMsgLog} onChange={(e) => setShowMsgLog(e.target.checked)} type="checkbox" className="w-4 h-4" />
                  <div>Show Message Log</div>
                </div>
              </div>
              {ShowMsgLog && (
                <div className="h-[150px] p-2 border border-gray-400 rounded  text-gray-500 text-md">
                  <div className=" h-full overflow-y-scroll customscrollbar  w-full  ">
                    <pre className="w-full text-sm  whitespace-pre-line">{Shop.MessageLog}</pre>
                  </div>
                </div>
              )}
              {SaveEn ? (
                <div onClick={save} className="w-full flex justify-end">
                  <div className="w-16 h-9 cursor-pointer select-none bg-indigo-500 text-white flex justify-center items-center rounded-md">Save</div>
                </div>
              ) : (
                <div  className="w-full flex justify-end">
                  <div className="w-16 h-9  select-none bg-indigo-300 text-white flex justify-center items-center rounded-md">Save</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AdminActionCard;
