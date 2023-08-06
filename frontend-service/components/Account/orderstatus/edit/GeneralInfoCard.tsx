import DropList from "../../../lib/DropList";
type props = {
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Role: string;
  setRole: (Role: ((n: string) => string) | string) => void;
  Type: string;
  setType: (Type: ((n: string) => string) | string) => void;
  Serial: number;
  setSerial: (Serial: ((n: number) => number) | number) => void;
};

function GeneralInfoCard({ Name, setName, Type, setRole, Role, setType, Serial, setSerial }: props) {
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
            <div className="text-gray-600">Type</div>
            <div className="w-full">
              <DropList
                List={[
                  { Id: "Success", Name: "Success" },
                  { Id: "Fail", Name: "Fail" },
                ]}
                Value={Type}
                setValue={setType}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Serial</div>
            <div className="w-full">
              <input type="number" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Serial} onChange={(e) => setSerial(e.target.valueAsNumber)} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-600">Role</div>
            <DropList List={["Admin", "Seller"].map((v) => ({ Id: v, Name: v }))} Value={Role} setValue={setRole} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoCard;
