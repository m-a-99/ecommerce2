import { useEffect, useState } from "react";
import { SocialProfilesType } from "../../../../../types/SotialProfilesType";
import IconsDropList from "../../../../lib/IconsDropList";


type props = {
  index: number;
  SocialMediaPlatforms: { _id: string; Icon: string; Name: string }[];
  SocialProfiles: SocialProfilesType;
  setSocialProfiles: (v: SocialProfilesType | ((b: SocialProfilesType) => SocialProfilesType)) => void;
};
const SocialProfileCard = ({ index, SocialMediaPlatforms, SocialProfiles, setSocialProfiles }: props) => {
  const [SocialMediaPlatform, setSocialMediaPlatform] = useState(SocialProfiles[index].SocialMediaPlatform);
  const [Url, setUrl] = useState(SocialProfiles[index].Url);

  useEffect(() => {
    setSocialProfiles((SocialProfiles) => {
      SocialProfiles = [...SocialProfiles];
      SocialProfiles[index].SocialMediaPlatform = SocialMediaPlatform;
      SocialProfiles[index].Url = Url;
      return SocialProfiles;
    });
  }, [SocialMediaPlatform, Url]);
  return (
    <div className="transition duration-150 ease-in-out flex space-x-5">

      <div className="space-y-1 w-1/2">
        <div className="text-gray-600">Select Social Platform</div>
        <div className="w-full">
          <IconsDropList
            List={SocialMediaPlatforms.map((v) => {
              return { Id: v._id, Name: v.Name, Url: v.Icon };
            })}
            Value={SocialMediaPlatform}
            setValue={setSocialMediaPlatform}
          />
        </div>
      </div>
      <div className="space-y-1 w-1/2">
        <div className="text-gray-600">Add Profile Url</div>
        <div className="w-full">
          <input value={Url} onChange={(e) => setUrl(e.target.value)} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default SocialProfileCard;
