import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useDeleteFetch from "../../custom_hooks/useDeleteFetch";
import usePostFetch from "../../custom_hooks/usePostFetch";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { setUserInfoValue } from "../../Redux/userInfo";
import ConfDelete from "../lib/ConfDelete";
import Spinner from "../lib/Spinner";


const Addresses = () => {
  const shipping = useRef<HTMLInputElement | null>(null);
  const billing = useRef<HTMLInputElement | null>(null);
  const userInfo = useAppSelector((state) => state.userInfo.value);
  const { data, IsPending, err, post } = usePostFetch();
  const { data: Deletedata, IsPending: DeleteIsPending, err: Deleteerr, Delete } = useDeleteFetch();
  const [addAddress, setaddAddress] = useState(false);
  const [addEnable, setaddEnable] = useState(false);
  const [DeleteEn,setDeleteEn]=useState(false)
  const [DeleteAddressType, setDeleteAddressType] = useState("");

  const dispatch = useAppDispatch();

  useEffect(()=>{
    if(addAddress){
      shipping.current?.click()
    }
  },[addAddress])

  const [AddressType, setAddressType] = useState("");
  const [Title, setTitle] = useState("");
  const [Country, setCountry] = useState("");
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [Zip, setZip] = useState("");
  const [StreetAddress, setStreetAddress] = useState("");

  useEffect(() => {
    if (AddressType === "Shipping") {
      setTitle(userInfo?.ShippingAddress?.Title || "");
      setCountry(userInfo?.ShippingAddress?.Country || "");
      setCity(userInfo?.ShippingAddress?.City || "");
      setState(userInfo?.ShippingAddress?.State || "");
      setZip(userInfo?.ShippingAddress?.Zip || "");
      setStreetAddress(userInfo?.ShippingAddress?.StreetAddress || "");
    }
    if (AddressType === "Billing") {
      setTitle(userInfo?.BillingAddress?.Title || "");
      setCountry(userInfo?.BillingAddress?.Country || "");
      setCity(userInfo?.BillingAddress?.City || "");
      setState(userInfo?.BillingAddress?.State || "");
      setZip(userInfo?.BillingAddress?.Zip || "");
      setStreetAddress(userInfo?.BillingAddress?.StreetAddress || "");
    }
    if (!AddressType) {
      setTitle("");
      setCountry("");
      setCity("");
      setState("");
      setZip("");
      setStreetAddress("");
    }
  }, [AddressType]);

  useEffect(()=>{
    if(err){
      toast(err.message,{type:"error"})
    }
    if (Deleteerr) {
      toast(Deleteerr.message, { type: "error" });
    }
  },[err,Deleteerr])

  useEffect(() => {
    if (data) {
      setAddressType("");
      dispatch(setUserInfoValue(data));
      setaddAddress(false);
    }
  }, [data]);

  useEffect(() => {
    if (Deletedata) {
      setAddressType("");
      dispatch(setUserInfoValue(Deletedata));
    }
  }, [Deletedata]);

  useEffect(() => {
    if (AddressType === "Shipping") {
      if (
        Title &&
        Country &&
        City &&
        State &&
        Zip &&
        StreetAddress &&
        (Title !== (userInfo?.ShippingAddress?.Title || "") || Country !== (userInfo?.ShippingAddress?.Country || "") || City !== (userInfo?.ShippingAddress?.City || "") || State !== (userInfo?.ShippingAddress?.State || "") || Zip !== (userInfo?.ShippingAddress?.Zip || "") || StreetAddress !== (userInfo?.ShippingAddress?.StreetAddress || ""))
      ) {
        setaddEnable(true);
      } else {
        setaddEnable(false);
      }
    } else if (AddressType === "Billing") {
      if (
        Title &&
        Country &&
        City &&
        State &&
        Zip &&
        StreetAddress &&
        (Title !== (userInfo?.BillingAddress?.Title || "") || Country !== (userInfo?.BillingAddress?.Country || "") || City !== (userInfo?.BillingAddress?.City || "") || State !== (userInfo?.BillingAddress?.State || "") || Zip !== (userInfo?.BillingAddress?.Zip || "") || StreetAddress !== (userInfo?.BillingAddress?.StreetAddress || ""))
      ) {
        setaddEnable(true);
      } else {
        setaddEnable(false);
      }
    }
  }, [AddressType, Title, Country, City, State, Zip, StreetAddress]);

  function DeleteAddressEnabel(Type: string) {
    setDeleteAddressType(Type);
    setDeleteEn(true)
  }
  function DeleteAddress(Type: string) {
    const payload: any = {};
    if (Type === "Shipping") {
      payload.AddressType = "Shipping";
    } else {
      payload.AddressType = "Billing";
    }
    Delete("/user-service/profile/address", JSON.stringify(payload));
    setDeleteEn(false);
    setDeleteAddressType("")
  }
  function add() {
    const payload: any = {};
    AddressType && (payload.AddressType = AddressType);
    Title && (payload.Title = Title);
    Country && (payload.Country = Country);
    City && (payload.City = City);
    State && (payload.State = State);
    Zip && (payload.Zip = Zip);
    StreetAddress && (payload.StreetAddress = StreetAddress);
    post("/user-service/profile/address", JSON.stringify(payload));
  }

  return (
    <div>
      {addAddress ? (
        <div className="bg-white  p-10 space-y-5 drop-shadow-md  rounded-md">
          {(IsPending || DeleteIsPending) && <Spinner />}
          <div className="flex justify-between text-zinc-600 text-lg font-semibold">
            <div>Add new Address</div>
            <div
              onClick={() => {
                setaddAddress(false);
              }}
            >
              <i className="text-red-500  text-2xl far fa-circle-xmark"></i>
            </div>
          </div>
          <div className="space-y-5">
            <div className=" flex justify-between space-x-5">
              <div className="w-[120px] border-r-2 ">
                <div className="flex space-x-2 cursor-pointer select-none text-zinc-600 font-semibold">
                  <input ref={shipping} type="radio" name="AddressType" value="Shipping" onChange={(e) => setAddressType(e.target.value)} />
                  <div onClick={() => shipping.current?.click()}>Shipping</div>
                </div>
                <div className="flex space-x-2 cursor-pointer select-none text-zinc-600 font-semibold">
                  <input ref={billing} type="radio" name="AddressType" value="Billing" onChange={(e) => setAddressType(e.target.value)} />
                  <div onClick={() => billing.current?.click()}>Billing</div>
                </div>
              </div>
              <div className="space-y-5">
                <div className=" flex space-x-5">
                  <div className="space-y-2">
                    <div>Title</div>
                    <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={Title} />
                  </div>
                  <div className="space-y-2">
                    <div>Country</div>
                    <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} value={Country} />
                  </div>

                  <div className="space-y-2">
                    <div>City</div>
                    <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="City" onChange={(e) => setCity(e.target.value)} value={City} />
                  </div>
                </div>
                <div className="flex space-x-5">
                  <div className="space-y-2 w-full">
                    <div>State</div>
                    <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="State" onChange={(e) => setState(e.target.value)} value={State} />
                  </div>

                  <div className="space-y-2 w-full">
                    <div>Zip</div>
                    <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Zip" onChange={(e) => setZip(e.target.value)} value={Zip} />
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    <div>Street Address</div>
                    <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="StreetAddress" onChange={(e) => setStreetAddress(e.target.value)} value={StreetAddress} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {addEnable ? (
                <div onClick={add} className="py-2 px-5 cursor-pointer select-none rounded-lg bg-indigo-500  text-white w-min font-semibold ">
                  Add
                </div>
              ) : (
                <div className="py-2 px-5  select-none rounded-lg bg-gray-500  text-white w-min font-semibold">Add</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 space-y-5 drop-shadow-md  rounded-md">
          {DeleteEn && <ConfDelete Cancel={() => setDeleteEn(false)} Delete={() => DeleteAddress(DeleteAddressType)} />}

          <div className="flex justify-between">
            <div className="flex space-x-2 items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex justify-center items-center text-white ">2</div>
              <div className="text-xl">Address</div>
            </div>
            <div
              onClick={() => {
                setaddAddress(true);
              }}
              className=" cursor-pointer select-none flex  font-semibold text-indigo-500 "
            >
              + Edit
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start lg:justify-start">
            {userInfo.ShippingAddress && (
              <div className=" max-w-[250px] min-w-[200px] whitespace-normal break-all   space-y-2 rounded-xl bg-gray-100  p-5 text-sm">
                <div className="flex justify-between ">
                  <div className="font-bold text-zinc-800">Shipping Address</div>
                  <div onClick={() => DeleteAddressEnabel("Shipping")} className="text-red-500 cursor-pointer select-none">
                    <i className="fa-solid fa-trash-xmark"></i>
                  </div>
                </div>
                <div>{userInfo.ShippingAddress?.Title}</div>
                <div>{userInfo.ShippingAddress?.StreetAddress}</div>
                <div>
                  {userInfo.ShippingAddress?.City},{userInfo.ShippingAddress?.State},{userInfo.ShippingAddress?.Zip},{userInfo.ShippingAddress?.Country}
                </div>
              </div>
            )}
            {userInfo.BillingAddress && (
              <div className=" max-w-[250px] min-w-[200px]  whitespace-normal break-all  space-y-2 rounded-xl bg-gray-100  p-5 text-sm">
                <div className="flex justify-between ">
                  <div className="font-bold text-zinc-800">Billing Address</div>
                  <div onClick={() => DeleteAddressEnabel("Billing")} className="text-red-500 cursor-pointer select-none">
                    <i className="fa-solid fa-trash-xmark"></i>
                  </div>
                </div>
                <div>{userInfo.BillingAddress?.Title}</div>
                <div>{userInfo.BillingAddress?.StreetAddress}</div>
                <div>
                  {userInfo.BillingAddress?.City},{userInfo.BillingAddress?.State},{userInfo.BillingAddress?.Zip},{userInfo.BillingAddress?.Country}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
