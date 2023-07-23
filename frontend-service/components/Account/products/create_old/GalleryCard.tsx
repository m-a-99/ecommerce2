import DragDropMany from "../../../lib/DragDropMany";
type props = {
  Gallery: FileList | null;
  setGallery: (file: FileList) => void;
};
const GalleryCard = ({ Gallery, setGallery }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Gallery Sliders </p>
          <p className="text-sm text-gray-400">Upload your product image gallery here</p>
        </div>
        <div className="w-7/12 h-[260px]">
          <DragDropMany fileType="image" extentions="jpg,png" files={Gallery} setfiles={setGallery} />
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
