import { useEffect, useRef, useState } from "react";
import NavList from "../../../components/Account/NavList";
import CoverImageCard from "../../../components/Account/shops/create/CoverImageCard";
import GeneralInfoCard from "../../../components/Account/shops/create/GeneralInfoCard";
import CreateShopHeadderCard from "../../../components/Account/shops/create/CreateShopHeadderCard";
import LogoCard from "../../../components/Account/shops/create/LogoCard";
import PaymentInfoCard from "../../../components/Account/shops/create/PaymentInfoCard";
import ShopAddressCard from "../../../components/Account/shops/create/ShopAddressCard";
import ShopSettingsCard from "../../../components/Account/shops/create/ShopSettingsCard";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import ShopActiveCard from "../../../components/Account/shops/create/ShopActiveCard";
import { useRouter } from "next/router";

const create = () => {
  const [Logo, setLogo] = useState<File | null>(null);
  const [CoverImage, setCoverImage] = useState<File | null>(null);
  const Name = useRef("");
  const Description = useRef("");
  const City = useRef("");
  const Country = useRef("");
  const State = useRef("");
  const StreetAddress = useRef("");
  const Zip = useRef("");
  const AccountHolderEmail = useRef("");
  const AccountHolderName = useRef("");
  const AccountNumber = useRef("");
  const BankName = useRef("");
  const ContactNumber = useRef("");
  const Website = useRef("");
  const Latitude = useRef("");
  const Longtude = useRef("");
  const Active = useRef(true);

  const { data: data1, IsPending: IsPending1, err: err1, post: post1 } = usePostFetch();
  const { data: data2, IsPending: IsPending2, err: err2, post: post2 } = usePostFetch();
  const { data: getdata, IsPending: getIsPending, err: geterr, get } = useGetFetch();

  const router=useRouter()
  function createupload() {
    get("/shops-service/shops/createuploadurl");
  }

  function createsshopdata() {
    const payload: any = {};
    if (Name.current) payload.Name = Name.current;
    if (Description.current) payload.Description = Description.current;
    if (City.current) payload.City = City.current;
    if (Country.current) payload.Country = Country.current;
    if (State.current) payload.State = State.current;
    if (StreetAddress.current) payload.StreetAddress = StreetAddress.current;
    if (Zip.current) payload.Zip = Zip.current;
    if (AccountHolderEmail.current) payload.AccountHolderEmail = AccountHolderEmail.current;
    if (AccountHolderName.current) payload.AccountHolderName = AccountHolderName.current;
    if (AccountNumber.current) payload.AccountNumber = AccountNumber.current;
    if (BankName.current) payload.BankName = BankName.current;
    if (ContactNumber.current) payload.ContactNumber = ContactNumber.current;
    if (Website.current) payload.Website = Website.current;
    if (Latitude.current) payload.Latitude = Latitude.current;
    if (Longtude.current) payload.Longtude = Longtude.current;
    payload.Active = Active.current;
    return payload;
  }

  useEffect(() => {
    if (getdata) {
      const formdata = new FormData();
      Logo && formdata.append("Logo", Logo);
      CoverImage && formdata.append("CoverImage", CoverImage);
      post1(getdata.UploadUrl, formdata, "formdata");
    }
  }, [getdata]);
  useEffect(() => {
    if (data1) {
      const payload = createsshopdata();
      payload.Logo = data1.Logo[0];
      payload.CoverImage = data1.CoverImage[0];
      post2("/shops-service/shops/createshop", JSON.stringify(payload), "json");
    }
  }, [data1]);

  useEffect(() => {
    if(data2){
      console.log(data2)
      router.back()
    }
  }, [data2]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <CreateShopHeadderCard />
            <GeneralInfoCard Name={Name} Description={Description} />
            <LogoCard Logo={Logo} setLogo={setLogo} />
            <CoverImageCard CoverImage={CoverImage} setCoverImage={setCoverImage} />
            <PaymentInfoCard AccountHolderEmail={AccountHolderEmail} AccountHolderName={AccountHolderName} AccountNumber={AccountNumber} BankName={BankName} />
            <ShopAddressCard City={City} Country={Country} State={State} StreetAddress={StreetAddress} Zip={Zip} />
            <ShopActiveCard Active={Active} />
            <ShopSettingsCard ContactNumber={ContactNumber} Website={Website} Latitude={Latitude} Longtude={Longtude} />
            <div className="flex justify-end">
              <div onClick={createupload} className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">
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
