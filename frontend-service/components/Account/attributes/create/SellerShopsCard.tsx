import { useEffect, useState } from "react";
import DropList from "../../../lib/DropList";
import { ShopsType } from "../../../../types/ShopsType";

type props = {
  Shops: ShopsType[],
  setShopId:(v:any)=>void
};

const SellerShopsCard = ({ setShopId, Shops }: props) => {
  
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Shop</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Choose Shop</div>
            <div className="w-full">
              <DropList List={Shops.map((shop) => ({ Id: shop._id, Name: shop.Name }))} Value="true" setValue={setShopId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerShopsCard;
