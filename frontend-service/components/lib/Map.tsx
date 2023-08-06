import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker,useLoadScript} from "@react-google-maps/api";

type props = {
  lat: number | undefined;
  setlat: any;
  lng: number | undefined;
  setlng: any;
  Location: { lng: number; lat: number };
  cancel:any
};
const Map = ({ lat, setlat, lng, setlng, Location,cancel }: props) => {
  const [show, setshow] = useState(false);
  const [marker, setmarker] = useState({lat,lng});
  const {isLoaded}=useLoadScript({
    googleMapsApiKey:""
  })
  useEffect(() => {
        document.body.style.setProperty("overflow", "hidden");

      setTimeout(() => {
        if (marker?.lat !== undefined && marker?.lng !== undefined) {
          setshow(true);
        }
      }, 500);
  
    return () => {
      document.body.style.setProperty("overflow", "auto");
    };
  }, [marker]);
  const center = useRef(Location);
  function ok(){
    setlat(marker.lat)
    setlng(marker.lng)
    cancel()
  }
  return (
    <div className="w-full  h-screen fixed flex justify-center items-center z-20 top-0 right-0 bg-black/10 backdrop-blur-sm ">
      <div className="w-1/2 h-2/3 relative rounded-lg overflow-clip">
        <div className="w-full h-full">
          {
            isLoaded&&<GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center.current}
              zoom={10}
              onClick={(e) => {
                setmarker({
                  lat: e.latLng?.lat() || Location.lat,
                  lng: e.latLng?.lng() || Location.lng,
                });
                  setshow(true);
              }}
            >
              {show && <Marker position={{lat:marker.lat||Location.lat,lng:marker.lng||Location.lng}} />}
            </GoogleMap>
          }
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm p-5 absolute left-1/2 -translate-x-1/2 bottom-4 w-1/2 flex justify-between rounded-2xl">
          <div
            onClick={ok}
            className=" cursor-pointer select-none hover:bg-zinc-300 transition ease-in-out text-center py-1 rounded-md bg-zinc-100 drop-shadow-md w-[80px]"
          >
            Ok
          </div>
          <div
            onClick={cancel}
            className=" cursor-pointer select-none hover:bg-zinc-300 transition ease-in-out text-center py-1 rounded-md bg-zinc-100 drop-shadow-md w-[80px]"
          >
            cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
