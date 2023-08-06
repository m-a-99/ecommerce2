import DropList from "../../../lib/DropList";
type props = {
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Role: string;
  setRole: (Role: ((n: string) => string) | string) => void;
  HasFail: boolean;
  setHasFail: (HasFail: ((n: boolean) => boolean) | boolean) => void;
  FailName: string;
  setFailName: (name: ((n: string) => string) | string) => void;
};

function GeneralInfoCard({ Name, setName, HasFail, setRole, Role, setHasFail, FailName, setFailName }: props) {
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
            <div className="text-gray-600">Role</div>
            <DropList List={["Admin", "Seller"].map((v) => ({ Id: v, Name: v }))} Value={Role} setValue={setRole} />
          </div>

          <div className="flex gap-2 items-center py-2">
            <input className="w-[15px] h-[15px]" checked={HasFail} type="checkbox" onChange={(e) => setHasFail(e.target.checked)} />
            <div className="text-gray-600">Add Fail State</div>
          </div>
          {HasFail && (
            <div className="space-y-1">
              <div className="text-gray-600">Fail Name</div>
              <div className="w-full">
                <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={FailName} onChange={(e) => setFailName(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoCard;
