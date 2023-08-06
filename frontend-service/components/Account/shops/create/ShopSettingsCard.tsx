import { useEffect, useState } from "react";
import Map from "../../../lib/Map";

type props = {
  ContactNumber: { current: string };
  Website: { current: string };
  Latitude: { current: string };
  Longtude: { current: string };
};

const ShopSettingsCard = ({
  ContactNumber,
  Latitude,
  Longtude,
  Website,
}: props) => {
  const [lat, setlat] = useState();
  const [lng, setlng] = useState();

  const [showmap,setshowmap]=useState(false);
  useEffect(() => {
    if (lat && lng) {
      Latitude.current = lat;
      Longtude.current = lng;
    }
  }, [lat, lng]);
  
  function closemap(){
    setshowmap(false)
  }

  function openmap(){
    setshowmap(true)
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      {showmap && <Map lat={lat} lng={lng} setlat={setlat} setlng={setlng} Location={{ lat: lat || 31.898043, lng: lng || 35.204269 }} cancel={closemap} />}

      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Shop Settings</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Set location from map</div>
            <div className="w-full">
              <input onClick={openmap} value={lng && lat ? `lng:${lng} , lat:${lat}` : ""} onChange={(e) => e.preventDefault()} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Contact Number</div>
            <div className="w-full">
              <input onChange={(e) => (ContactNumber.current = e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600"> Website</div>
            <div className="w-full">
              <input onChange={(e) => (Website.current = e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsCard;
