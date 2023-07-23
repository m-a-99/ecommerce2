import React, { useEffect, useState } from "react";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import NavList from "../../../../components/Account/NavList";
import Headder from "../../../../components/layout/headder";
import EditShopHeadderCard from "../../../../components/Account/shops/edit/EditShopHeadderCard";
import GeneralInfoCard from "../../../../components/Account/shops/edit/GeneralInfoCard";
import LogoCard from "../../../../components/Account/shops/edit/LogoCard";
import CoverImageCard from "../../../../components/Account/shops/edit/CoverImageCard";
import PaymentInfoCard from "../../../../components/Account/shops/edit/PaymentInfoCard";
import ShopAddressCard from "../../../../components/Account/shops/edit/ShopAddressCard";
import ShopActiveCard from "../../../../components/Account/shops/edit/ShopActiveCard";
import ShopSettingsCard from "../../../../components/Account/shops/edit/ShopSettingsCard";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { store } from "../../../../Redux/store";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { ShopsType } from "../../../../types/ShopsType";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";
import Spinner from "../../../../components/lib/Spinner";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");

  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (!["Admin", "Seller"].includes(store.getState().userInfo.value?.AccountType || "")) {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
  const ShopId = context.params?.id || "";
  const [shop] = await Promise.all([(await fetch(`http://nginx-proxy/shops-service/shops/${ShopId}`, { headers: { Authorization: cookies["jwt"] } })).json()]);
  if (shop.ok===false) {
    return {
      notFound: true,

    };
  }
  return {
    props: {
      shop,
      InitialState: store.getState(),
    },
  };
};
function Edit({ shop }: { shop: ShopsType }) {
  const [LogoSrc, setLogoSrc] = useState(shop.Logo);
  const [CoverImageSrc, setCoverImageSrc] = useState(shop.CoverImage);
  const [Logo, setLogo] = useState<File | null>(null);
  const [CoverImage, setCoverImage] = useState<File | null>(null);
  const [Name, setName] = useState(shop.Name);
  const [Description, setDescription] = useState(shop.Description);
  const [City, setCity] = useState(shop?.Address?.City || "");
  const [Country, setCountry] = useState(shop?.Address?.Country || "");
  const [State, setState] = useState(shop?.Address?.State || "");
  const [StreetAddress, setStreetAddress] = useState(shop?.Address?.StreetAddress || "");
  const [Zip, setZip] = useState(shop?.Address?.Zip || "");
  const [AccountHolderEmail, setAccountHolderEmail] = useState(shop?.PaymentInfo?.AccountHolderEmail || "");
  const [AccountHolderName, setAccountHolderName] = useState(shop?.PaymentInfo?.AccountHolderName || "");
  const [AccountNumber, setAccountNumber] = useState(shop?.PaymentInfo?.AccountNumber || "");
  const [BankName, setBankName] = useState(shop?.PaymentInfo?.BankName || "");
  const [ContactNumber, setContactNumber] = useState(shop?.ShopSettings?.ContactNumber || "");
  const [Website, setWebsite] = useState(shop?.ShopSettings?.Website || "");
  const [Latitude, setLatitude] = useState(shop?.ShopSettings?.Location?.Latitude || 0);
  const [Longtude, setLongtude] = useState(shop?.ShopSettings?.Location?.Longtude || 0);
  const [Active, setActive] = useState(shop.Active);

  const [enEnable, setenEnable] = useState(false);

  const { data: data1, IsPending: IsPending1, err: err1, post: post1 } = usePostFetch();
  const { data: data2, IsPending: IsPending2, err: err2, put } = usePutFetch();
  const { data: getdata, IsPending: getIsPending, err: geterr, get } = useGetFetch();

  const router = useRouter();
  function createEdit() {
    if (Logo || CoverImage) {
      get("/shops-service/shops/createuploadurl");
    } else {
      const payload = createsshopdata();
      put("/shops-service/shops/" + router.query.id, JSON.stringify(payload), "json");
    }
  }

  function createsshopdata() {
    const payload: any = {};
    if (Name !== shop.Name) payload.Name = Name;
    if (Description !== shop.Description) payload.Description = Description;
    if (City !== shop?.Address?.City) payload.City = City;
    if (Country !== shop?.Address?.Country) payload.Country = Country;
    if (State !== shop?.Address?.State) payload.State = State;
    if (StreetAddress !== shop?.Address?.StreetAddress) payload.StreetAddress = StreetAddress;
    if (Zip !== shop?.Address?.Zip) payload.Zip = Zip;
    if (AccountHolderEmail !== shop?.PaymentInfo?.AccountHolderEmail) payload.AccountHolderEmail = AccountHolderEmail;
    if (AccountHolderName !== shop?.PaymentInfo?.AccountHolderName) payload.AccountHolderName = AccountHolderName;
    if (AccountNumber !== shop?.PaymentInfo?.AccountNumber) payload.AccountNumber = AccountNumber;
    if (BankName !== shop?.PaymentInfo?.BankName) payload.BankName = BankName;
    if (ContactNumber !== shop?.ShopSettings?.ContactNumber) payload.ContactNumber = ContactNumber;
    if (Website !== shop?.ShopSettings?.Website) payload.Website = Website;
    if (Latitude !== shop?.ShopSettings?.Location?.Latitude) payload.Latitude = Latitude;
    if (Longtude !== shop?.ShopSettings?.Location?.Longtude) payload.Longtude = Longtude;
    if (Active !== shop.Active) payload.Active = Active;
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
      Logo && (payload.Logo = data1.Logo[0]);
      CoverImage && (payload.CoverImage = data1.CoverImage[0]);
      put("/shops-service/shops/" + router.query.id, JSON.stringify(payload), "json");
    }
  }, [data1]);

  useEffect(() => {
    if (data2) {
      console.log(data2);
      router.back();
    }
  }, [data2]);

  useEffect(() => {
    if (
      Logo ||
      CoverImage ||
      Name !== shop.Name ||
      Description !== shop.Description ||
      City !== shop?.Address?.City ||
      Country !== shop?.Address?.Country ||
      State !== shop?.Address?.State ||
      StreetAddress !== shop?.Address?.StreetAddress ||
      Zip !== shop?.Address?.Zip ||
      AccountHolderEmail !== shop?.PaymentInfo?.AccountHolderEmail ||
      AccountHolderName !== shop?.PaymentInfo?.AccountHolderName ||
      AccountNumber !== shop?.PaymentInfo?.AccountNumber ||
      BankName !== shop?.PaymentInfo?.BankName ||
      ContactNumber !== shop?.ShopSettings?.ContactNumber ||
      Website !== shop?.ShopSettings?.Website ||
      Latitude !== shop?.ShopSettings?.Location?.Latitude ||
      Longtude !== shop?.ShopSettings?.Location?.Longtude ||
      Active !== shop.Active
    ) {
      setenEnable(true);
    } else {
      setenEnable(false);
    }
  }, [Logo, CoverImage, Name, Description, City, Country, State, StreetAddress, Zip, AccountHolderEmail, AccountHolderName, AccountNumber, BankName, ContactNumber, Website, Latitude, Longtude, Active]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 relative">
          {(IsPending1 || IsPending2 || getIsPending) && <Spinner />}

          <form className="space-y-10">
            <EditShopHeadderCard />
            <GeneralInfoCard Name={Name} Description={Description} setName={setName} setDescription={setDescription} />
            <LogoCard LogoSrc={LogoSrc} Logo={Logo} setLogo={setLogo} />
            <CoverImageCard CoverImageSrc={CoverImageSrc} CoverImage={CoverImage} setCoverImage={setCoverImage} />
            <PaymentInfoCard setAccountHolderEmail={setAccountHolderEmail} AccountHolderEmail={AccountHolderEmail} setAccountHolderName={setAccountHolderName} AccountHolderName={AccountHolderName} setAccountNumber={setAccountNumber} AccountNumber={AccountNumber} setBankName={setBankName} BankName={BankName} />
            <ShopAddressCard setCity={setCity} City={City} setCountry={setCountry} Country={Country} setState={setState} State={State} setStreetAddress={setStreetAddress} StreetAddress={StreetAddress} setZip={setZip} Zip={Zip} />
            <ShopActiveCard setActive={setActive} Active={Active} />
            <ShopSettingsCard setContactNumber={setContactNumber} ContactNumber={ContactNumber} setWebsite={setWebsite} Website={Website} setLatitude={setLatitude} Latitude={Latitude} setLongtude={setLongtude} Longtude={Longtude} />
            <div className="flex justify-end">
              {enEnable ? (
                <div onClick={createEdit} className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">
                  Save
                </div>
              ) : (
                <div className="px-5  drop-shadow-lg   transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">Save</div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit;
