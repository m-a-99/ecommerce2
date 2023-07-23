import { useEffect, useState } from "react";
import Map from "../../../lib/Map";

type props = {
  ContactNumber: string;
  setContactNumber: (v: string) => void;
  Website: string;
  setWebsite: (v: string) => void;
  Latitude: number;
  setLatitude: (v: number) => void;
  Longtude: number;
  setLongtude: (v: number) => void;
};

const ShopSettingsCard = ({ ContactNumber, Latitude, Longtude, Website, setContactNumber, setWebsite, setLatitude, setLongtude }: props) => {

  const [showmap, setshowmap] = useState(false);

  function closemap() {
    setshowmap(false);
  }

  function openmap() {
    setshowmap(true);
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      {showmap && <Map lat={Latitude} setlat={setLatitude} lng={Longtude} setlng={setLongtude} Location={{ lat: Latitude || -3.745, lng: Longtude || -38.523 }} cancel={closemap} />}

      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Shop Settings</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Set location from map</div>
            <div className="w-full">
              <input onClick={openmap} value={Longtude && Latitude ? `lng:${Longtude} , lat:${Latitude}` : ""} onChange={(e) => e.preventDefault()} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Contact Number</div>
            <div className="w-full">
              <input value={ContactNumber} onChange={(e) => setContactNumber (e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600"> Website</div>
            <div className="w-full">
              <input value={Website} onChange={(e) => setWebsite (e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsCard;
