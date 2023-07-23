import React from "react";
import { ShopsType } from "../../../types/ShopsType";
import Image from "next/image";

function ShopInfoCard({ shop }: { shop: ShopsType }) {
  return (
    <div className="p-7 bg-white gap-3  flex flex-col items-center rounded-lg">
      <div>
        <Image src={"http://nginx-proxy/" + shop.Logo} alt="" width={200} height={200} className="rounded-full border border-gray-200" />
      </div>
      <div className="font-bold text-gray-700 text-xl  text-center">{shop.Name}</div>
      <p className="text-zinc-500 text-center font-serif">{shop.Description}</p>
      <div className="my-2 space-y-2 ">
        <div className="text-gray-600 flex gap-2  space-x-2 self-start font-serif">
          <i className="fas fa-location-dot"></i>
          <div>
            {shop.Address.StreetAddress}, {shop.Address.City}, {shop.Address.State}, {shop.Address.Zip}, {shop.Address.Country}
          </div>
        </div>
        <div className="text-gray-600 space-x-2 self-start font-serif">
          <i className="fas fa-phone"></i>
          <span> {shop.ShopSettings.ContactNumber}</span>
        </div>
      </div>
    </div>
  );
}

export default ShopInfoCard;
