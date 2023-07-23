import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BannersType } from "../../../../../types/GroupsType";
import DragDrop from "../../../../lib/DragDrop";

type props = {
  index: number;
  Banners:  BannersType ;
  setBanners: (v: BannersType | ((b: BannersType) => BannersType)) => void;
};
const BannerCard = ({ index, Banners ,setBanners}: props) => {
  const [Title, setTitle] = useState((Banners[index].Title));
  const [Description, setDescription] = useState(Banners[index].Description);
  const [BannerFile, setBannerFile] = useState<File | null>(Banners[index].Banner);

  useEffect(() => {
    // Banners.current[index].Title=Title;
    // Banners.current[index].Description = Description;
    // Banners.current[index].Banner=BannerFile
    setBanners((banner) => {
      banner=[...banner]
      banner[index].Title = Title;
      banner[index].Description = Description;
      banner[index].Banner = BannerFile;
      return banner;
    });
  }, [Title, Description, BannerFile]);
  return (
    <div className="transition duration-150 ease-in-out">
      <div className="space-y-1">
        <div className="text-gray-600">Title</div>
        <div className="w-full">
          <input value={Title} onChange={(e) => setTitle(e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Description</div>
        <div className="w-full">
          <textarea value={Description} onChange={(e) => setDescription(e.target.value)} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
        </div>
      </div>

      <div className="h-[150px] space-y-1">
        <div className="text-gray-600">Image</div>

        <DragDrop fileType="image" extentions="jpg,png" file={BannerFile} setfile={setBannerFile} />
      </div>
    </div>
  );
};

export default BannerCard;
