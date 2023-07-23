import { useState } from "react";
import DragDrop from "../../../lib/DragDrop";
import DropList from "../../../lib/DropList";
import IconsDropList from "../../../lib/IconsDropList";

type props = {
  Icon:string;
  setIcon: (file: string) => void;
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Icons:{Name:string,Url:string,_id:string}[]
};

const GeneralInfoCard = ({ Name, setName, Icon, setIcon ,Icons }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Group Name</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Group Icon</div>
            <IconsDropList List={Icons.map(v=>{
              return {Id:v._id,Name:v.Name,Url:v.Url}
            })} Value={Icon} setValue={setIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoCard;
