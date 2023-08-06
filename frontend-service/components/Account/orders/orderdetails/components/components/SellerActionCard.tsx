import React, { useEffect, useState } from "react";
import DropList from "../../../../../lib/DropList";
import { OrderShop, OrdersType } from "../../../../../../types/OrdersType";
import { useRouter } from "next/router";
import usePutFetch from "../../../../../../custom_hooks/usePutFetch";
import Spinner from "../../../../../lib/Spinner";
import { OrderStatusType } from "../../../../../../types/OrderStatusType";

type props = {
  Shop: OrderShop;
  OrderStatus: OrderStatusType[];
  OrderState: OrdersType;
  setOrderState: (v: OrdersType | ((v: OrdersType) => OrdersType)) => void;
};

function SellerActionCard({ Shop,OrderState, setOrderState, OrderStatus }: props) {
  const [showSellerAction, setshowSellerAction] = useState(false);
  const [State, setState] = useState(Shop.ShopOrderStatus._id);
  const { IsPending, data, err, put } = usePutFetch();
  const router = useRouter();
  const [SaveEn, setSaveEn] = useState(false);

  const { id } = router.query || {};

  function save() {
    const payload: any = {};
    State && (payload.StatusId = State);
    payload.ShopId = Shop.ShopId;
    put("/shopping-service/orders/ordershops/status/" + id, JSON.stringify(payload));
  }

  useEffect(() => {
    let en = false;

    if (State !== Shop.ShopOrderStatus._id) {
      en = true;
    }
    setSaveEn(en);
  }, [Shop, State, OrderState]);

  useEffect(() => {
    if (data) {
      const Status = OrderStatus.find((os) => os._id === State);
      if (Status) {
        setOrderState((v) => {
          const order = { ...v };
          order.OrderShops.forEach((shop) => {
            if (shop.ShopId === Shop.ShopId) {
              shop.ShopOrderStatus = Status;
            }
          });
          return order;
        });
      }
    }
  }, [data]);

  return (
    <>
      <div>
        <div onClick={() => setshowSellerAction((v) => !v)} className="font-semibold flex justify-center items-center gap-1 m-auto  w-max text-indigo-500 font-mono cursor-pointer hover:text-indigo-600">
          <div>Seller Action</div>
          <i className={`fa-sharp fa-solid fa-caret-${showSellerAction ? "down" : "right"}`}></i>
        </div>
      </div>
      {showSellerAction && (
        <div className="relative text-left bg-white rounded-md  border border-gray-200 px-10 w-full">
          {IsPending && <Spinner />}

          <div className="flex justify-between border-b py-10">
            <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
              <p>Product State</p>
            </div>
            <div className="w-7/12 space-y-4">
              <div className="space-y-1">
                <div className="text-gray-600">Choose State</div>
                <div className="w-full">
                  <DropList List={OrderStatus.map((state) => ({ Id: state._id, Name: state.Name }))} Value={State} setValue={setState} />
                </div>
              </div>
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
      )}
    </>
  );
}

export default SellerActionCard;
