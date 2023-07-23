import { SocialMediaPlatformsType, SocialProfilesType } from "../../../../types/SotialProfilesType";
import SocialProfileCard from "./components/SocialProfileCard";

type props = {
  SocialMediaPlatforms: SocialMediaPlatformsType;
  SocialProfiles: SocialProfilesType;
  setDeletedSocialProfilesIds: (v: string[] | ((v: string[]) => string[])) => void;
  setSocialProfiles: (v: SocialProfilesType | ((b: SocialProfilesType) => SocialProfilesType)) => void;
};
const SocialProfilesCard = ({ SocialMediaPlatforms, setDeletedSocialProfilesIds, SocialProfiles, setSocialProfiles }: props) => {
  function add() {
    // AttributeValues.current.push({ AttributeValue: null, Description: "", Title: "" });
    setSocialProfiles((SocialProfiles) => {
      SocialProfiles = [...SocialProfiles];
      SocialProfiles.push({
        Key: crypto.randomUUID(),
        SocialMediaPlatform: "",
        Url: "",
      });
      return SocialProfiles;
    });
  }
  function remove(Key: string, id: string) {
    setSocialProfiles((SocialProfiles) => {
      return SocialProfiles.filter((v) => v.Key !== Key);
    });
    if (id) {
      setDeletedSocialProfilesIds((v) => [...v, id]);
    }
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full ">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Social Profiles </p>
          <p className="text-sm text-gray-400">Add your Social Profiles </p>
        </div>
        <div className="w-7/12 space-y-16">
          {SocialProfiles.map((SocialProfile, index) => {
            return (
              <div key={SocialProfile.Key} className="space-y-5">
                <div className="flex justify-between  items-center ">
                  <div className="text-gray-500 font-semibold ">Social Profile {index + 1}</div>
                  <div onClick={() => remove(SocialProfile.Key, SocialProfile._id || "")} className="text-red-500 cursor-pointer  select-none">
                    Remove
                  </div>
                </div>
                <SocialProfileCard SocialMediaPlatforms={SocialMediaPlatforms} index={index} SocialProfiles={SocialProfiles} setSocialProfiles={setSocialProfiles} />
              </div>
            );
          })}
          <div>
            <div onClick={add} className="px-6 py-1 rounded-md bg-zinc-500 w-max text-white cursor-pointer">
              Add Value
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProfilesCard;
