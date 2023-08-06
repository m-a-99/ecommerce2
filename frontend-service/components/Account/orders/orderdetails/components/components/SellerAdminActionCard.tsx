import React, { useState } from 'react'
import { OrderShop } from '../../../../../../types/OrdersType';
type props = {
  Shop: OrderShop;
};
function SellerAdminActionCard({ Shop }:props) {
    const [showAdminAction, setshowAdminAction] = useState(false);

      const [ShowMsgLog, setShowMsgLog] = useState(false);

  return (
    <>
      <div>
        <div onClick={() => setshowAdminAction((v) => !v)} className="font-semibold flex justify-center items-center gap-1 m-auto  w-max text-indigo-500 font-mono cursor-pointer hover:text-indigo-600">
          <div>Admin Action</div>
          <i className={`fa-sharp fa-solid fa-caret-${showAdminAction ? "down" : "right"}`}></i>
        </div>
      </div>
      {showAdminAction && (
    <div className="bg-white rounded-md border border-gray-200 text-left px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Product State</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">State</div>
            <div className="w-full">
              <div className="px-4 h-[50px]  flex items-center text-gray-600 border border-gray-400 rounded-md">{Shop.AdminDeliveryStatus}</div>
            </div>
          </div>
          <div>
            <div className="text-gray-600">Admin Massage</div>
            <div className="p-2 rounded-md overflow-hidden border border-gray-400 ">
              <textarea disabled value={Shop.Message} className="w-full h-[100px] outline-none   resize-none px-2 py-2 text-gray-600 customscrollbar cursor-auto bg-transparent"></textarea>
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
        </div>
      </div>
    </div>)}
      </>  );


}

export default SellerAdminActionCard