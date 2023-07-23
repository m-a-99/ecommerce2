import Image from "next/image";
import DragDrop from "../../../lib/DragDrop";
type props = {
  Logo: File|null;
  LogoSrc:string;
  setLogo: (file: File) => void;
};
const LogoCard = ({LogoSrc,Logo,setLogo}: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Logo</p>
          <p className="text-sm text-gray-400">Upload your Shop Logo</p>
        </div>
        <div className="flex gap-1">
          <div className="w-1/3 h-[160px] flex justify-center items-center  border-2 border-gray-300 rounded-xl border-dashed">
            <Image src={"http://nginx-proxy/" + LogoSrc} alt="" width={150} height={150} />
          </div>
          <div className="w-2/3 h-[160px]">
            <DragDrop fileType="image" extentions="jpg,png" file={Logo} setfile={setLogo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
