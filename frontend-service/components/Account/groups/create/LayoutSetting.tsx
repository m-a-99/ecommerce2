import { useEffect, useState } from "react";
import LayoutCard from "./components/LayoutCard";
type props = {
  Layout: string;
  setLayout: (v: string) => void;
  ProductCard: string;
  IsMainGroup: boolean;
  setIsMainGroup: (v: boolean) => void;
  setProductCard: (v: string) => void;
};
const LayoutSetting = ({ Layout, ProductCard, setLayout, setProductCard, IsMainGroup, setIsMainGroup }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-4">
          <div className="flex space-x-3 items-center">
            <input checked={IsMainGroup} onChange={(e) => setIsMainGroup(e.target.checked)} type="checkbox" className="w-[17px] h-[17px]" />
            <div className="text-gray-600">Is Main Page</div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-600">Select Layout</div>
            <div className="grid grid-cols-3 gap-4">
              <LayoutCard name="clasic" Key="63acc80cedb0087b1b10e3b9" value={Layout} setvalue={setLayout} />
              <LayoutCard name="clasic2" Key="63acc80cedb0087b1b10e3b1" value={Layout} setvalue={setLayout} />
              <LayoutCard name="clasic3" Key="63acc80cedb0087b1b10e3b2" value={Layout} setvalue={setLayout} />
              <LayoutCard name="clasic4" Key="63acc80cedb0087b1b10e3b3" value={Layout} setvalue={setLayout} />
              <LayoutCard name="clasic5" Key="63acc80cedb0087b1b10e1b4" value={Layout} setvalue={setLayout} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-600">Select Product Card</div>
            <div className="grid grid-cols-3 gap-4">
              <LayoutCard name="clasic" Key="63acc80cedb0087b1b10e3b4" value={ProductCard} setvalue={setProductCard} />
              <LayoutCard name="clasic2" Key="63acc80cedb0087b1b10e3b5" value={ProductCard} setvalue={setProductCard} />
              <LayoutCard name="clasic3" Key="63acc80cedb0087b1b10e3b6" value={ProductCard} setvalue={setProductCard} />
              <LayoutCard name="clasic4" Key="63acc80cedb0087b1b10e3b7" value={ProductCard} setvalue={setProductCard} />
              <LayoutCard name="clasic5" Key="63acc80cedb0087b1b10e3b8" value={ProductCard} setvalue={setProductCard} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutSetting;
