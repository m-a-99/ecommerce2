import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import GeneralInfoCard from "../../../../components/Account/shippings/edit/GeneralInfoCard";
import EditShippingHeadderCard from "../../../../components/Account/shippings/edit/EditShippingHeadderCard";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { store } from "../../../../Redux/store";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { ShippingType } from "../../../../types/ShippingType";
import usePutFetch from "../../../../custom_hooks/usePutFetch";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context?.req?.headers?.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  const id = context?.params?.id || "";
  const [shipping] = await Promise.all([fetch(`http://nginx-proxy/shopping-service/shippings/${id}`, { headers: { Authorization: cookies["jwt"] } }).then((res) => res.json())]);

  return {
    props: {
      shipping,
      InitialState: store.getState(),
    },
  };
};

const Edit = ({ shipping }: { shipping: ShippingType }) => {
  const [Amount, setAmount] = useState(shipping.Amount || 0);
  const [Global, setGlobal] = useState(shipping.Global);
  const [Name, setName] = useState(shipping.Name);
  const [Country, setCountry] = useState(shipping?.Local?.Country || "");
  const [State, setState] = useState(shipping?.Local?.State || "");
  const [ZIP, setZIP] = useState(shipping?.Local?.ZIP || "");
  const [ShippingType, setShippingType] = useState(shipping.ShippingType);

  const [SaveEn, setSaveEn] = useState(false);
  const { data, IsPending, err, put } = usePutFetch();
  const router = useRouter();

  useEffect(() => {
    let en = false;
    if (Name && ShippingType) {
      if (Amount !== shipping.Amount || Name !== shipping.Name || ShippingType !== shipping.ShippingType) {
        en = true;
      }
      if (Global !== shipping.Global) {
        en = true;
      }

      if (Global === false) {
        if (Country && State && ZIP) {
          if (Country !== shipping?.Local?.Country || State !== shipping?.Local?.State || ZIP !== shipping?.Local?.ZIP) {
            en = true;
          }
        } else {
          en = false;
        }
      }
      setSaveEn(en);
    }
  }, [Amount, Global, Name, Country, State, ZIP, ShippingType]);

  function Save() {
    const payload: any = {};
    if (Amount) payload.Amount = Amount;
    if (Country) payload.Country = Country;
    if (Name) payload.Name = Name;
    if (State) payload.State = State;
    if (ShippingType) payload.ShippingType = ShippingType;
    if (ZIP) payload.ZIP = ZIP;
    payload.Global = Global;
    const id = router.query.id || "";
    put(`/shopping-service/shippings/${id}`, JSON.stringify(payload), "json");
  }

  useEffect(() => {
    if (data) {
      router.back();
    }
  }, [data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100 p-10 ">
          <form className="space-y-10">
            <EditShippingHeadderCard />

            <GeneralInfoCard Amount={Amount} Country={Country} Global={Global} Name={Name} State={State} ShippingType={ShippingType} ZIP={ZIP} setAmount={setAmount} setCountry={setCountry} setGlobal={setGlobal} setName={setName} setState={setState} setShippingType={setShippingType} setZIP={setZIP} />
            <div className="flex justify-end">
              {SaveEn ? (
                <div onClick={Save} className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">
                  Save
                </div>
              ) : (
                <div className="px-5 drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">Save</div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
