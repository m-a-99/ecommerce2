type props = {
  City: string;
  setCity: (v: string) => void;
  Country: string;
  setCountry: (v: string) => void;
  State: string;
  setState: (v: string) => void;
  StreetAddress: string;
  setStreetAddress: (v: string) => void;
  Zip: string;
  setZip: (v: string) => void;
};
const ShopAddressCard = ({ City, Country, State, StreetAddress, Zip, setCity, setCountry, setState, setStreetAddress, setZip }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Shop Address</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Country</div>
            <div className="w-full">
              <input value={Country} onChange={(e) => setCountry(e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">City</div>
            <div className="w-full">
              <input value={City} onChange={(e) => setCity( e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600"> State</div>
            <div className="w-full">
              <input value={State} onChange={(e) =>setState(  e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">ZIP</div>
            <div className="w-full">
              <input value={Zip} onChange={(e) => setZip (e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Street Address</div>
            <div className="w-full">
              <textarea value={StreetAddress} onChange={(e) => setStreetAddress ( e.target.value)} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAddressCard;
