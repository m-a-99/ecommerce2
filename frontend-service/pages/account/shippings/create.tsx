import { useEffect, useRef, useState } from "react";
import GeneralInfoCard from "../../../components/Account/shippings/create/GeneralInfoCard";
import CreateShippingHeadderCard from "../../../components/Account/shippings/create/CreateShippingHeadderCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { useRouter } from "next/router";
import { ParseCookies } from "../../../utils/ParseCookies";
import { GetServerSideProps } from "next";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context?.req?.headers?.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  const id = context?.params?.id || "";
  return {
    props: {
      InitialState: store.getState(),
    },
  };
};
const create = () => {
  const [Amount, setAmount] = useState(0);
  const [Country, setCountry] = useState("");
  const [Global, setGlobal] = useState(true);
  const [Name, setName] = useState("");
  const [State, setState] = useState("");
  const [ShippingType, setShippingType] = useState("Free");
  const [ZIP, setZIP] = useState("");

  const { data: data, IsPending: IsPending, err: err, post: post } = usePostFetch();

  const router = useRouter();

  function create() {
    const payload: any = {};
    if (Amount) payload.Amount = Amount;
    if (Country) payload.Country = Country;
    if (Name) payload.Name = Name;
    if (State) payload.State = State;
    if (ShippingType) payload.ShippingType = ShippingType;
    if (ZIP) payload.ZIP = ZIP;
    payload.Global = Global;

    post("/shopping-service/shippings", JSON.stringify(payload), "json");
  }

  useEffect(() => {
    if (data) {
      console.log(data);
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
            <CreateShippingHeadderCard />
            <GeneralInfoCard Amount={Amount} Country={Country} Global={Global} Name={Name} State={State} ShippingType={ShippingType} ZIP={ZIP} setAmount={setAmount} setCountry={setCountry} setGlobal={setGlobal} setName={setName} setState={setState} setShippingType={setShippingType} setZIP={setZIP} />
            <div className="flex justify-end">
              <div onClick={create} className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">
                create
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default create;
