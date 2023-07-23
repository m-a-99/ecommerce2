import DragDrop from "../../../lib/DragDrop";
type props = {
  FeaturedImage: File | null;
  setFeaturedImage: (file: File) => void;
};
const FeaturedImageCard = ({ FeaturedImage, setFeaturedImage }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Featured Image</p>
          <p className="text-sm text-gray-400">Upload your shop cover image from here Dimension of the cover image should be 1170 x 435px</p>
        </div>
        <div className="w-7/12 h-[160px]">
          <DragDrop fileType="image" extentions="jpg,png" file={FeaturedImage} setfile={setFeaturedImage} />
        </div>
      </div>
    </div>
  );
};

export default FeaturedImageCard;
