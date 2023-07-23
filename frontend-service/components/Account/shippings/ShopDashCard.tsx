import React from "react"
import { ShopsType } from "../../../types/ShopsType";

function ShopDashCard({ shop }: { shop: ShopsType }) {
  return (
    <div className="w-full h-full gap-10 flex bg-white rounded-md p-7">
      <div className="w-1/2 space-y-3">
        <h2 className="text-gray-700 font-semibold text-lg">Products</h2>
        <div className="flex w- gap-4 border border-gray-200 p-2 items-center">
          <div className="w-12 text-lg h-12 flex items-center justify-center bg-red-400 rounded-full text-white drop-shadow-sm  ">
            <i className="far fa-cube"></i>
          </div>
          <div>
            <div className="font-bold text-gray-700">{shop?.ProductsCount}</div>
            <div className="text-gray-500">Total Products</div>
          </div>
        </div>
        <div className="flex w- gap-4 border border-gray-200 p-2 items-center">
          <div className="w-12 text-lg h-12 flex items-center justify-center bg-blue-400 rounded-full text-white drop-shadow-sm  ">
            <i className="fa-solid fa-bring-forward"></i>
          </div>
          <div>
            <div className="font-bold text-gray-700">41</div>
            <div className="text-gray-500">Total Orders</div>
          </div>
        </div>
      </div>
      <div className="w-1/2 space-y-3">
        <h2 className="text-gray-700 font-semibold text-lg">Revenue</h2>
        <div className="flex w- gap-4 border border-gray-200 p-2 items-center">
          <div className="w-12 text-lg h-12 flex items-center justify-center bg-pink-500 rounded-full text-white drop-shadow-sm  ">
            <i className="far fa-messages-dollar"></i>
          </div>
          <div>
            <div className="font-bold text-gray-700"></div>
            <div className="text-gray-500">Gross Sales</div>
          </div>
        </div>
        <div className="flex w- gap-4 border border-gray-200 p-2 items-center">
          <div className="w-12 text-lg h-12 flex items-center justify-center bg-purple-500 rounded-full text-white drop-shadow-sm  ">
            <i className="far fa-dollar-sign"></i>
          </div>
          <div>
            <div className="font-bold text-gray-700"></div>
            <div className="text-gray-500">Current Balance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopDashCard