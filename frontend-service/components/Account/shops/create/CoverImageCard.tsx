import DragDrop from "../../../lib/DragDrop";
type props = {
  CoverImage: File | null;
  setCoverImage: (file: File) => void;
};
const CoverImageCard = ({ CoverImage, setCoverImage }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Cover Image</p>
          <p className="text-sm text-gray-400">
            Upload your shop cover image from here Dimension of the cover image
            should be 1170 x 435px
          </p>
        </div>
        <div className="w-7/12 h-[160px]">
          <DragDrop
            fileType="image"
            extentions="jpg,png"
            file={CoverImage}
            setfile={setCoverImage}
          />
        </div>
      </div>
    </div>
  );
};

export default CoverImageCard;
