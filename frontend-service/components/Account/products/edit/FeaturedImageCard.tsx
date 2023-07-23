import Image from "next/image";
import DragDrop from "../../../lib/DragDrop";
type props = {
  FeaturedImageSrc:string
  FeaturedImage: File | null;
  setFeaturedImage: (file: File) => void;
};
const FeaturedImageCard = ({FeaturedImageSrc, FeaturedImage, setFeaturedImage }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Featured Image</p>
          <p className="text-sm text-gray-400">Upload your shop cover image from here Dimension of the cover image should be 1170 x 435px</p>
        </div>
        <div className="flex gap-1">
          <div className="w-1/3 h-[160px] flex justify-center items-center  border-2 border-gray-300 rounded-xl border-dashed">
            <Image src={"http://nginx-proxy/" + FeaturedImageSrc} alt="" width={150} height={150} />
          </div>
          <div className="w-2/3 h-[160px]">
            <DragDrop fileType="image" extentions="jpg,png" file={FeaturedImage} setfile={setFeaturedImage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedImageCard;
