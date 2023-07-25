import { useEffect, useRef, useState } from "react";
import ConfDelete from "../lib/ConfDelete";
import { useAppSelector } from "../../Redux/hooks";
import { AddressType } from "../../types/UserInfoType";
type props = {
  BillingAddress: AddressType;
  setBillingAddress: (v: AddressType | ((v: AddressType) => AddressType)) => void;
  ShippingAddress: AddressType;
  setShippingAddress: (v: AddressType | ((v: AddressType) => AddressType)) => void;
};
const Addresses = ({ BillingAddress, setBillingAddress, ShippingAddress, setShippingAddress }: props) => {
  const userInfo = useAppSelector((state) => state.userInfo.value);
  const [addAddress, setaddAddress] = useState(false);
  const [addEnable, setaddEnable] = useState(false);
  const [DeleteEn, setDeleteEn] = useState(false);
  const [DeleteAddressType, setDeleteAddressType] = useState("");

  const shipping = useRef<HTMLInputElement | null>(null);
  const billing = useRef<HTMLInputElement | null>(null);
  const [AddressType, setAddressType] = useState("Shipping");

  useEffect(() => {
    if (AddressType === "Shipping") {
      if (
        ShippingAddress.Title &&
        ShippingAddress.Country &&
        ShippingAddress.City &&
        ShippingAddress.State &&
        ShippingAddress.Zip &&
        ShippingAddress.StreetAddress &&
        (ShippingAddress.Title !== (userInfo?.ShippingAddress?.Title || "") ||
          ShippingAddress.Country !== (userInfo?.ShippingAddress?.Country || "") ||
          ShippingAddress.City !== (userInfo?.ShippingAddress?.City || "") ||
          ShippingAddress.State !== (userInfo?.ShippingAddress?.State || "") ||
          ShippingAddress.Zip !== (userInfo?.ShippingAddress?.Zip || "") ||
          ShippingAddress.StreetAddress !== (userInfo?.ShippingAddress?.StreetAddress || ""))
      ) {
        setaddEnable(true);
      } else {
        setaddEnable(false);
      }
    } else if (AddressType === "Billing") {
      if (
        BillingAddress.Title &&
        BillingAddress.Country &&
        BillingAddress.City &&
        BillingAddress.State &&
        BillingAddress.Zip &&
        BillingAddress.StreetAddress &&
        (BillingAddress.Title !== (userInfo?.BillingAddress?.Title || "") ||
          BillingAddress.Country !== (userInfo?.BillingAddress?.Country || "") ||
          BillingAddress.City !== (userInfo?.BillingAddress?.City || "") ||
          BillingAddress.State !== (userInfo?.BillingAddress?.State || "") ||
          BillingAddress.Zip !== (userInfo?.BillingAddress?.Zip || "") ||
          BillingAddress.StreetAddress !== (userInfo?.BillingAddress?.StreetAddress || ""))
      ) {
        setaddEnable(true);
      } else {
        setaddEnable(false);
      }
    }
  }, [AddressType, ShippingAddress, BillingAddress]);

  function DeleteAddressEnabel(Type: string) {
    setDeleteAddressType(Type);
    setDeleteEn(true);
  }

  function DeleteAddress(Type: string) {
    setDeleteEn(false);
    setDeleteAddressType("");
  }
  function add() {
    setaddAddress(false);
  }

  return (
    <div>
      {addAddress ? (
        <div className="bg-white  p-10 space-y-5 drop-shadow-md  rounded-md">
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
                  <input ref={shipping} type="radio" name="AddressType" value="Shipping" checked={AddressType === "Shipping"} onChange={(e) => setAddressType(e.target.value)} />
                  <div onClick={() => shipping.current?.click()}>Shipping</div>
                </div>
                <div className="flex space-x-2 cursor-pointer select-none text-zinc-600 font-semibold">
                  <input ref={billing} type="radio" name="AddressType" value="Billing" checked={AddressType === "Billing"} onChange={(e) => setAddressType(e.target.value)} />
                  <div onClick={() => billing.current?.click()}>Billing</div>
                </div>
              </div>
              {AddressType === "Shipping" ? (
                <div className="space-y-5">
                  <div className=" flex space-x-5">
                    <div className="space-y-2">
                      <div>Title</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Title" onChange={(e) => setShippingAddress((v) => ({ ...v, Title: e.target.value }))} value={ShippingAddress.Title} />
                    </div>
                    <div className="space-y-2">
                      <div>Country</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Country" onChange={(e) => setShippingAddress((v) => ({ ...v, Country: e.target.value }))} value={ShippingAddress.Country} />
                    </div>

                    <div className="space-y-2">
                      <div>City</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="City" onChange={(e) => setShippingAddress((v) => ({ ...v, City: e.target.value }))} value={ShippingAddress.City} />
                    </div>
                  </div>
                  <div className="flex space-x-5">
                    <div className="space-y-2 w-full">
                      <div>State</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="State" onChange={(e) => setShippingAddress((v) => ({ ...v, State: e.target.value }))} value={ShippingAddress.State} />
                    </div>

                    <div className="space-y-2 w-full">
                      <div>Zip</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Zip" onChange={(e) => setShippingAddress((v) => ({ ...v, Zip: e.target.value }))} value={ShippingAddress.Zip} />
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div>Street Address</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="StreetAddress" onChange={(e) => setShippingAddress((v) => ({ ...v, StreetAddress: e.target.value }))} value={ShippingAddress.StreetAddress} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className=" flex space-x-5">
                    <div className="space-y-2">
                      <div>Title</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Title" onChange={(e) => setBillingAddress((v) => ({ ...v, Title: e.target.value }))} value={BillingAddress.Title} />
                    </div>
                    <div className="space-y-2">
                      <div>Country</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Country" onChange={(e) => setBillingAddress((v) => ({ ...v, Country: e.target.value }))} value={BillingAddress.Country} />
                    </div>
                    <div className="space-y-2">
                      <div>City</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="City" onChange={(e) => setBillingAddress((v) => ({ ...v, City: e.target.value }))} value={BillingAddress.City} />
                    </div>
                  </div>
                  <div className="flex space-x-5">
                    <div className="space-y-2 w-full">
                      <div>State</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="State" onChange={(e) => setBillingAddress((v) => ({ ...v, State: e.target.value }))} value={BillingAddress.State} />
                    </div>

                    <div className="space-y-2 w-full">
                      <div>Zip</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="Zip" onChange={(e) => setBillingAddress((v) => ({ ...v, Zip: e.target.value }))} value={BillingAddress.Zip} />
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div>Street Address</div>
                      <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md" type="text" placeholder="StreetAddress" onChange={(e) => setBillingAddress((v) => ({ ...v, StreetAddress: e.target.value }))} value={BillingAddress.StreetAddress} />
                    </div>
                  </div>
                </div>
              )}
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
                </div>
                <div>{ShippingAddress.Title}</div>
                <div>{ShippingAddress.StreetAddress}</div>
                <div>
                  {ShippingAddress.City},{ShippingAddress.State},{ShippingAddress.Zip},{ShippingAddress.Country}
                </div>
              </div>
            )}
            {userInfo.BillingAddress && (
              <div className=" max-w-[250px] min-w-[200px]  whitespace-normal break-all  space-y-2 rounded-xl bg-gray-100  p-5 text-sm">
                <div className="flex justify-between ">
                  <div className="font-bold text-zinc-800">Billing Address</div>
                </div>
                <div>{BillingAddress.Title}</div>
                <div>{BillingAddress.StreetAddress}</div>
                <div>
                  {BillingAddress.City},{BillingAddress.State},{BillingAddress.Zip},{BillingAddress.Country}
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
