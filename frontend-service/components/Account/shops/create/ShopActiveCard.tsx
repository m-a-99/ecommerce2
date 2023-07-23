import { useEffect, useState } from "react";
import DropList from "../../../lib/DropList";

type props = {
  Active: {current:boolean};
};

const ShopActiveCard = ({ Active }: props) => {
  const [value,setValue]=useState("")
  useEffect(() => {
    if(value){
      Active.current = value==="true"?true:false;
    }
  }, [value]);
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Shop Status</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Active</div>
            <div className="w-full">
              <DropList
                List={[
                  { Id: "true", Name: "Active" },
                  { Id: "false", Name: "Inactive" },
                ]}
                Value="true"
                setValue={setValue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopActiveCard;
