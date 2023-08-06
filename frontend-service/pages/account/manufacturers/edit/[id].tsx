import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import { useEffect, useState } from "react";
import { SocialMediaPlatformsType, SocialProfilesType } from "../../../../types/SotialProfilesType";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import EditManufacturerHeadderCard from "../../../../components/Account/manufacturer/edit/EditManufacturerHeadderCard";
import LogoCard from "../../../../components/Account/manufacturer/edit/LogoCard";
import CoverImageCard from "../../../../components/Account/manufacturer/edit/CoverImageCard";
import SellerShopsCard from "../../../../components/Account/manufacturer/edit/SellerShopsCard";
import SocialProfilesCard from "../../../../components/Account/manufacturer/edit/SocialProfilesCard";
import GeneralInfoCard from "../../../../components/Account/manufacturer/edit/GeneralInfoCard";
import { GroupsType } from "../../../../types/GroupsType";
import { ShopsType } from "../../../../types/ShopsType";
import { ManufacturerType, SocialMediaPlatformProfile } from "../../../../types/ManufacturersType";
import { useAppSelector } from "../../../../Redux/hooks";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Seller" && store.getState().userInfo.value?.AccountType !== "Admin") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
  const id = context?.params?.id || "";
  const fetches = [fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/socialmediaplatforms").then((res) => res.json()), fetch("http://nginx-proxy/shops-service/manufacturers/" + id, { headers: { Authorization: cookies["jwt"] } }).then((r) => r.json())];
  if (store.getState().userInfo.value?.AccountType === "Seller") {
    fetches.push(fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } }).then((r) => r.json()));
  }
  const [Groups, SocialMediaPlatforms, Manufacturer, SellerShops] = await Promise.all(fetches);
  return {
    props: {
      Groups,
      SocialMediaPlatforms,
      Manufacturer,
      SellerShops: SellerShops || [],
      InitialState: store.getState(),
    },
  };
};

function create({ Groups, SocialMediaPlatforms, SellerShops, Manufacturer }: { Groups: GroupsType; SocialMediaPlatforms: SocialMediaPlatformsType; SellerShops: ShopsType[]; Manufacturer: ManufacturerType }) {
  const [Name, setName] = useState(Manufacturer.Name || "");
  const [Website, setWebsite] = useState(Manufacturer.Website || "");
  const [Group, setGroup] = useState(Manufacturer.Group || "");
  const [Description, setDescription] = useState(Manufacturer.Description || "");
  const [SocialProfilesState, setSocialProfilesState] = useState(Manufacturer.SocialProfiles || []);
  const [SocialProfiles, setSocialProfiles] = useState<SocialProfilesType>([]);
  const [LogoSrc, setLogoSrc] = useState(Manufacturer.Logo || "");
  const [CoverImageSrc, setCoverImageSrc] = useState(Manufacturer.CoverImage || "");
  const [Logo, setLogo] = useState<File | null>(null);
  const [CoverImage, setCoverImage] = useState<File | null>(null);
  const [ShopId, setShopId] = useState(Manufacturer.ShopId || "");
  const [DeletedSocialProfilesIds, setDeletedSocialProfilesIds] = useState<string[]>([]);
  const [saveEnable, setsaveEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, put } = usePutFetch();

  const router = useRouter();

  const userInfo = useAppSelector((state) => state.userInfo.value);

  useEffect(() => {
    if (Array.isArray(SocialProfilesState)) {
      let tmp: SocialProfilesType = [];
      SocialProfilesState.forEach((profile) => {
        tmp.push({ Key: profile._id, _id: profile._id, Url: profile.Url, SocialMediaPlatform: profile.SocialMediaPlatform._id });
      });
      setSocialProfiles(tmp);
    }
  }, [SocialProfilesState]);

  useEffect(() => {
    let en = false;
    if (Name && Group && Description && (Logo || Manufacturer.Logo) && (CoverImage || Manufacturer.CoverImage)) {
      if (Name !== Manufacturer.Name || Website !== Manufacturer.Website || Description !== Manufacturer.Description || Logo || CoverImage) {
        en = true;
      }
      const tmp: any = {};
      SocialProfilesState.forEach((profile) => {
        tmp[profile._id] = profile;
      });
      if (DeletedSocialProfilesIds.length > 0) {
        en = true;
      }
      for (const profile of SocialProfiles) {
        if (tmp[profile._id as string]) {
          if (profile.SocialMediaPlatform !== tmp[profile._id as string].SocialMediaPlatform._id || profile.Url !== tmp[profile._id as string].Url) {
            en = true;
          }
        } else {
          en = true;
        }

        if (!(profile.SocialMediaPlatform && profile.Url)) {
          en = false;
        }
      }
    }
    setsaveEnable(en);
  }, [Name, Website, Group, Description, Logo, CoverImage, SocialProfiles, DeletedSocialProfilesIds]);

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
    DeletedSocialProfilesIds.length > 0 && (payload.DeletedSocialProfilesIds = DeletedSocialProfilesIds);

    const id = router?.query?.id || "";
    put("/shops-service/manufacturers/" + id, JSON.stringify(payload));
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
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100  p-10 ">
          <form className="space-y-10">
            <EditManufacturerHeadderCard />
            <LogoCard LogoSrc={LogoSrc} Logo={Logo} setLogo={setLogo} />
            <CoverImageCard CoverImageSrc={CoverImageSrc} CoverImage={CoverImage} setCoverImage={setCoverImage} />
            {userInfo.AccountType === "Seller" && <SellerShopsCard Shops={SellerShops} ShopId={ShopId} setShopId={setShopId} />}
            <GeneralInfoCard Groups={Groups} Name={Name} setName={setName} Website={Website} setWebsite={setWebsite} Group={Group} setGroup={setGroup} Description={Description} setDescription={setDescription} />
            <SocialProfilesCard setDeletedSocialProfilesIds={setDeletedSocialProfilesIds} SocialMediaPlatforms={SocialMediaPlatforms} SocialProfiles={SocialProfiles} setSocialProfiles={setSocialProfiles} />
            {saveEnable ? (
              <div onClick={createUploadUrl} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">Save</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5  drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">Save</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default create;
