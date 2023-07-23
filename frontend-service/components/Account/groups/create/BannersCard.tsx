import { BannersType } from "../../../../types/GroupsType";
import BannerCard from "./components/BannerCard";

type props = {
  Banners: BannersType;
  setBanners: (v: BannersType | ((b: BannersType) => BannersType)) => void;
};
const BannersCard = ({ Banners,setBanners }: props) => {
  function add() {
    // Banners.current.push({ Banner: null, Description: "", Title: "" });
    setBanners((banner) => {
      banner=[...banner]
      banner.push({
        Key:crypto.randomUUID(),
        Banner: null,
        Description: "",
        Title: "",
      });
      return banner;
    });
  }
  function remove(index: number) {
    setBanners(banners=>{
      banners=[...banners];
      banners.splice(index, 1);
      return banners
    })
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full ">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Banner </p>
          <p className="text-sm text-gray-400">Add your banner image with title and description from here. Dimension of the banner should be 1920 x 1080 px for full screen banner and 1500 x 450 px for small banner</p>
        </div>
        <div className="w-7/12 space-y-16">
          {Banners.map((Banner, index) => {
            return (
              <div key={Banner.Key} className="space-y-5">
                <div className="flex justify-between  items-center ">
                  <div className="text-gray-500 font-semibold ">Banner {index + 1}</div>
                  <div onClick={() => remove(index)} className="text-red-500 cursor-pointer  select-none">
                    Remove
                  </div>
                </div>
                <BannerCard index={index} Banners={Banners} setBanners={setBanners} />
              </div>
            );
          })}
          <div>
            <div onClick={add} className="px-6 py-1 rounded-md bg-zinc-500 w-max text-white cursor-pointer">
              Add banner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannersCard;
