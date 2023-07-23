import DragDrop from "../../../lib/DragDrop";
type props = {
  Logo: File|null;
  setLogo: (file: File) => void;
};
const LogoCard = ({Logo,setLogo}: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Logo</p>
          <p className="text-sm text-gray-400">Upload your Shop Logo</p>
        </div>
        <div className="w-7/12 h-[160px]">
          <DragDrop
            fileType="image"
            extentions="jpg,png"
            file={Logo}
            setfile={setLogo}
          />
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
