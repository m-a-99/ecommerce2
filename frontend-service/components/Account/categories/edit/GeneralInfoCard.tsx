import { CategoriesType } from "../../../../types/CategoriesType";
import { GroupsType } from "../../../../types/GroupsType";
import { IconsType } from "../../../../types/IconsType";
import DropList from "../../../lib/DropList";
import IconsDropList from "../../../lib/IconsDropList";
type props = {
  Categories: CategoriesType
  Icons:IconsType
  Groups: GroupsType
  Icon: string;
  setIcon: (icon: string) => void;
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Details: string;
  setDetails: (v: string) => void;
  Group: string;
  setGroup: (v: string) => void;
};

const GeneralInfoCard = ({Categories, Icons, Groups, Icon, setIcon, Name, setName, Details, setDetails, Group, setGroup }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full ">
      <div className="flex justify-between border-b py-10 h-[600px]">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-4">
          <div className="space-y-1">
            <div className="text-gray-600">Name</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Details</div>
            <div className="w-full">
              <textarea className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Details} onChange={(e) => setDetails(e.target.value)} />
            </div>
          </div>
       
           <div className="space-y-1">
              <div className="text-gray-600">Group</div>
              <div className="w-full">
                <DropList
                  List={Groups.map((v) => {
                    return { Id: v._id, Name: v.Name };
                  })}
                  Value={Group}
                  setValue={setGroup}
                />
              </div>
            </div>

          <div className="space-y-1">
            <div className="text-gray-600">Icon</div>
            <IconsDropList
              List={Icons.map((v) => {
                return { Id: v._id, Name: v.Name, Url: v.Url };
              })}
              Value={Icon}
              setValue={setIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoCard;
