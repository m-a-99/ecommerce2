type props = {
  City: { current: string };
  Country: { current: string };
  State: { current: string };
  StreetAddress: { current: string };
  Zip: { current: string };
};
const ShopAddressCard = ({
  City,
  Country,
  State,
  StreetAddress,
  Zip,
}: props) => {
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
              <input
                onChange={(e) => (Country.current = e.target.value)}
                type="text"
                className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">City</div>
            <div className="w-full">
              <input
                onChange={(e) => (City.current = e.target.value)}
                type="text"
                className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600"> State</div>
            <div className="w-full">
              <input
                onChange={(e) => (State.current = e.target.value)}
                type="text"
                className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">ZIP</div>
            <div className="w-full">
              <input
                onChange={(e) => (Zip.current = e.target.value)}
                type="text"
                className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Street Address</div>
            <div className="w-full">
              <textarea
                onChange={(e) => (StreetAddress.current = e.target.value)}
                className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAddressCard;
