import React from 'react'
import { ShopsType } from '../../../types/ShopsType';

function ShopPaymentInfoCard({ shop }: { shop: ShopsType }) {
    console.log(shop)
  return (
    <div className="bg-white p-5 h-full w-full rounded-md">
      <div className="border-b border-gray-200 py-2">
        <h2 className=" text-gray-700 "> Registered Since</h2>
        <div className="text-gray-500 ">{new Date(shop.createdAt).toLocaleString("en-GB", { dateStyle: "medium" })}</div>
      </div>
      <div className="py-2 space-y-2">
        <h2 className="font-bold text-gray-700">Payment Information</h2>
        <div>
          <div className="text-gray-500">Name : {shop?.PaymentInfo?.AccountHolderName}</div>
          <div className="text-gray-500">Email : {shop?.PaymentInfo?.AccountHolderEmail}</div>
          <div className="text-gray-500">Bank : {shop?.PaymentInfo?.BankName}</div>
          <div className="text-gray-500">Account No. : {shop?.PaymentInfo?.AccountNumber}</div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default ShopPaymentInfoCard