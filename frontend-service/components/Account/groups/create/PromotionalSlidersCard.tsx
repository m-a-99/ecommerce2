import { useState } from "react";
import DragDrop from "../../../lib/DragDrop";
import DragDropMany from "../../../lib/DragDropMany";
type props = {
  PromotionalSliders: FileList | null;
  setPromotionalSliders: (file: FileList) => void;
};
const PromotionalSlidersCard = ({ PromotionalSliders, setPromotionalSliders }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Promotional Sliders </p>
          <p className="text-sm text-gray-400">Upload Promotional Sliders</p>
        </div>
        <div className="w-7/12 h-[260px]">
          <DragDropMany
            fileType="image"
            extentions="jpg,png"
            files={PromotionalSliders}
            setfiles={setPromotionalSliders}
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionalSlidersCard;
