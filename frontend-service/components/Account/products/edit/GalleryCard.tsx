import Image from "next/image";
import DragDropMany from "../../../lib/DragDropMany";
type props = {
  GallerySrc:string[];
  Gallery: FileList | null;
  setGallery: (file: FileList) => void;
};
const GalleryCard = ({GallerySrc, Gallery, setGallery }: props) => {
  return (
    <div className="bg-white relative  rounded-md shadow-md px-10 w-full">
      <div className="flex  justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Gallery Sliders </p>
          <p className="text-sm text-gray-400">Upload your product image gallery here</p>
          <div className="flex  max-h-[200px]  py-5  relative flex-wrap gap-1 overflow-y-auto customscrollbar">
            {GallerySrc.map((src) => (
                <div key={src} className="w-[31%] relative  flex justify-center items-center  select-none border-2 border-gray-300 rounded-xl border-dashed">
                  {/* <div className="w-5 h-5 -top-1 -right-1 text-white bg-red-500/80 absolute  flex justify-center items-center cursor-pointer select-none hover:bg-red-500 rounded-full ">
                    <i className="far fa-xmark"></i>
                  </div> */}
                  <Image src={"http://nginx-proxy/" + src} alt="" width={100} height={100} />
                </div>
            ))}
          </div>
        </div>
        <div className="w-7/12 h-[260px]">
          <DragDropMany fileType="image" extentions="jpg,png" files={Gallery} setfiles={setGallery} />
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
