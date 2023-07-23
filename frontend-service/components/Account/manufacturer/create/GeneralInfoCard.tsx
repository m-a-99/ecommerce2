import { GroupsType } from "../../../../types/GroupsType";
import DropList from "../../../lib/DropList";

type props = {
  Website: string;
  setWebsite: (v: string) => void;
  Description: string;
  setDescription: (v: string) => void;
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Group: string;
  setGroup: (v: string) => void;
  Groups: GroupsType
};

function GeneralInfoCard({ Group, setGroup, Name, setName, Website, setWebsite, Description, setDescription, Groups }: props) {
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
            <div className="text-gray-600">Website</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Description</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoCard;
