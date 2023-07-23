import { useEffect, useState } from "react";
import CoverImageCard from "../../../components/Account/manufacturer/create/CoverImageCard";
import CreateManufacturerHeadderCard from "../../../components/Account/manufacturer/create/CreateManufacturerHeadderCard";
import GeneralInfoCard from "../../../components/Account/manufacturer/create/GeneralInfoCard";
import LogoCard from "../../../components/Account/manufacturer/create/LogoCard";
import SocialProfilesCard from "../../../components/Account/manufacturer/create/SocialProfilesCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { SocialProfilesType } from "../../../types/SotialProfilesType";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import SellerShopsCard from "../../../components/Account/manufacturer/edit/SellerShopsCard";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Seller") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
  const [Groups, SocialMediaPlatforms, SellerShops] = await Promise.all([fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/socialmediaplatforms").then((res) => res.json()),     fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } }).then((r) => r.json())]);
  return {
    props: {
      Groups,
      SocialMediaPlatforms,
      SellerShops,
      InitialState: store.getState(),
    },
  };
};


function create({ Groups, SocialMediaPlatforms, SellerShops }: any) {
  const [Name, setName] = useState("");
  const [Website, setWebsite] = useState("");
  const [Group, setGroup] = useState("");
  const [Description, setDescription] = useState("");
  const [SocialProfiles, setSocialProfiles] = useState<SocialProfilesType>([]);
  const [Logo, setLogo] = useState<File | null>(null);
  const [CoverImage, setCoverImage] = useState<File | null>(null);
  const [ShopId, setShopId] = useState("");
  const [createEnable, setcreateEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, post: post2 } = usePostFetch();

  useEffect(() => {
    if (Name && Website && Group && Description && Logo && CoverImage) {
      let check = true;
      if (SocialProfiles.length > 0) {
        for (let i = 0; i < SocialProfiles.length; i++) {
          if (!(SocialProfiles[i].SocialMediaPlatform && SocialProfiles[i].Url)) {
            check = false;
            break;
          }
        }
      }
      if (check) setcreateEnable(true);
      else {
        setcreateEnable(false);
      }
    } else {
      setcreateEnable(false);
    }
  }, [Name, Website, Group, Description, Logo, CoverImage, SocialProfiles]);

  function createUploadUrl() {
    get("/shops-service/manufacturers/createuploadurl");
  }
  function create(resdata: any) {
    const payload: any = {};
    Name && (payload.Name = Name);
    Website && (payload.Website = Website);
    Group && (payload.Group = Group);
    Description && (payload.Description = Description);
    ShopId && (payload.ShopId = ShopId);
    resdata.Logo && resdata.Logo[0] && (payload.Logo = resdata.Logo[0]);
    resdata.CoverImage && resdata.CoverImage[0] && (payload.CoverImage = resdata.CoverImage[0]);
    SocialProfiles.length > 0 && (payload.SocialProfiles = SocialProfiles);

    post2("/shops-service/manufacturers/createmanufacturer", JSON.stringify(payload));
  }

  useEffect(() => {
    if (Getdata) {
      const formdata = new FormData();
      Logo && formdata.append("Logo", Logo);
      CoverImage && formdata.append("CoverImage", CoverImage);
      post1(Getdata.UploadUrl, formdata, "formdata");
    }
  }, [Getdata]);

  useEffect(() => {
    if (post1data) {
      create(post1data);
    }
  }, [post1data]);

  useEffect(() => {
    if (post2data) {
      console.log(post2data);
    }
  }, [post2data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <CreateManufacturerHeadderCard />
            <LogoCard Logo={Logo} setLogo={setLogo} />
            <CoverImageCard CoverImage={CoverImage} setCoverImage={setCoverImage} />
            <SellerShopsCard Shops={SellerShops} ShopId={ShopId} setShopId={setShopId} />
            <GeneralInfoCard Groups={Groups} Name={Name} setName={setName} Website={Website} setWebsite={setWebsite} Group={Group} setGroup={setGroup} Description={Description} setDescription={setDescription} />
            <SocialProfilesCard SocialMediaPlatforms={SocialMediaPlatforms} SocialProfiles={SocialProfiles} setSocialProfiles={setSocialProfiles} />
            {createEnable ? (
              <div onClick={createUploadUrl} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">create</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5  drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">create</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default create;
