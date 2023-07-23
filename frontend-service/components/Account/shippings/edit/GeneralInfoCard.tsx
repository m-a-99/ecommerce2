import DropList from "../../../lib/DropList";

type props = {
  Name: string;
  ShippingType: string;
  Global: boolean;
  Amount: number;
  Country: string;
  State: string;
  ZIP: string;
  setName: (v: string) => void;
  setShippingType: (v: string) => void;
  setGlobal: (v: boolean) => void;
  setAmount: (v: number) => void;
  setCountry: (v: string) => void;
  setState: (v: string) => void;
  setZIP: (v: string) => void;
};
const GeneralInfoCard = ({ Name, ShippingType, Global, Amount, setName, setShippingType, setGlobal, setAmount, Country, State, ZIP, setCountry, setState, setZIP }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Shipping Name</div>
            <div className="w-full">
              <input type="text" value={Name} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Shipping Type</div>
            <div className="w-full">
              <DropList
                List={[
                  { Id: "Free", Name: "Free" },
                  { Id: "Fixed", Name: "Fixed" },
                  { Id: "Percentage", Name: "Percentage" },
                ]}
                Value={ShippingType}
                setValue={setShippingType}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Amount</div>
            <div className="w-full">
              <input type="number" value={Amount||""} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" onChange={(e) => setAmount(e.target.valueAsNumber)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-full flex gap-1 items-center ">
              <input type="checkbox" checked={Global} className="w-4 h-4" onChange={(e) => setGlobal(e.target.checked)} />
              <div className="text-gray-600">Global</div>
            </div>
          </div>
          {!Global && (
            <div>
              <div className="space-y-1">
                <div className="text-gray-600">Country</div>
                <div className="w-full">
                  <input type="text" value={Country} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-600">State</div>
                <div className="w-full">
                  <input type="text" value={State} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" onChange={(e) => setState(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-600">ZIP</div>
                <div className="w-full">
                  <input type="text" value={ZIP} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" onChange={(e) => setZIP(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoCard;
