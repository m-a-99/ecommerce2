import Image from "next/image";
import DragDrop from "../../../lib/DragDrop";
type props = {
  Icon: File | null;
  setIcon: (file: File) => void;
  Name: string;
  IconSrc:string
  setName: (name: ((n: string) => string) | string) => void;
};

function GeneralInfoCard({ Name, setName, IconSrc,Icon, setIcon }: props) {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Name</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Icon</div>
            <div className="flex gap-1">
              <div className="w-1/3 h-[160px] flex justify-center items-center  border-2 border-gray-300 rounded-xl border-dashed">
                <Image src={"http://nginx-proxy/" + IconSrc} alt="" width={150} height={150} />
              </div>
              <div className="w-2/3 h-[160px]">
                <DragDrop extentions="jpg,svg,png" fileType="image" file={Icon} setfile={setIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoCard;
