import { useEffect, useRef, useState } from "react";
import BannersCard from "../../../components/Account/groups/create/BannersCard";
import CreateGroupHeadderCard from "../../../components/Account/groups/create/CreateGroupHeadderCard";
import GeneralInfoCard from "../../../components/Account/groups/create/GeneralInfoCard";
import LayoutSetting from "../../../components/Account/groups/create/LayoutSetting";
import PromotionalSlidersCard from "../../../components/Account/groups/create/PromotionalSlidersCard";
import NavList from "../../../components/Account/NavList";

import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { BannersType } from "../../../types/GroupsType";

export async function getServerSideProps(){
  const res = await fetch("http://nginx-proxy/admin-service/icons");
  
  const Icons=await res.json();

  return { props: { Icons } };
 
}
const create = ({ Icons }: any) => {
  const [Name, setName] = useState("");
  const [Icon, setIcon] = useState("");
  const [Layout, setLayout] = useState("");
  const [ProductCard, setProductCard] = useState("");
  const [IsMainGroup, setIsMainGroup] = useState(false);
  const [PromotionalSliders, setPromotionalSliders] = useState<FileList | null>(null);
  const [Banners, setBanners] = useState<BannersType>([]);
  const [createEnable, setcreateEnable] = useState(false);

  const { data: GetData, IsPending: GetIsPending, err: GetErr, get } = useGetFetch();
  const { data: Post1Data, IsPending: Post1Ispending, err: Post1Err, post: post1 } = usePostFetch();
  const { data: Post2Data, IsPending: Post2Ispending, err: Post2Err, post: post2 } = usePostFetch();

  useEffect(() => {
    if (Name.length > 0 && Icon.length > 0 && Layout.length > 0 && ProductCard.length > 0 && (PromotionalSliders?.length || 0) > 0 && Banners.length > 0) {
      let checkbanners = true;
      for (let i = 0; i < Banners.length; i++) {
        if (!(Banners[i].Banner && Banners[i].Description && Banners[i].Title)) {
          checkbanners = false;
          break;
        }
      }
      if (checkbanners) {
        setcreateEnable(true);
      } else {
        setcreateEnable(false);
      }
      setcreateEnable(true);
    } else {
      setcreateEnable(false);
    }
  }, [Name, Icon, Layout, ProductCard, PromotionalSliders, Banners]);

  function createUploadUrl() {
    get(`/admin-service/groups/createuploadurl?PromotionalSliders=${PromotionalSliders?.length || 0}&Banners=${Banners.length}`);
  }
  function create() {
    if (Post1Data) {
      const payload: any = {};
      Name && (payload.Name = Name);
      Layout && (payload.Layout = Layout);
      ProductCard && (payload.ProductCard = ProductCard);
      IsMainGroup && (payload.IsMainGroup = IsMainGroup);
      Icon&&(payload.Icon = Icon);
      payload.PromotionalSliders = Post1Data.PromotionalSliders;
      Banners.length > 0 &&
        (payload.Banners = Banners.map((v, index) => {
          const val = { ...v };
          console.log(Post1Data);
          Post1Data["Banner" + (index + 1)] && (val.Banner = Post1Data["Banner" + (index + 1)][0]);
          return val;
        }));
      post2("/admin-service/groups/creategroup", JSON.stringify(payload));
    }
  }
  useEffect(() => {
    if (GetData) {
      const formdata = new FormData();
      if (PromotionalSliders) {
        for (let i = 0; i < PromotionalSliders?.length; i++) {
          formdata.append("PromotionalSliders", PromotionalSliders[i]);
        }
      }
      for (let i = 0; i < Banners.length; i++) {
        Banners[i].Banner && formdata.append("Banner" + (i + 1), Banners[i]?.Banner as File);
      }
      post1(GetData.UploadUrl, formdata, "formdata");
    }
  }, [GetData]);

  useEffect(() => {
    if (Post1Data) {
      create();
    }
  }, [Post1Data]);

  useEffect(() => {
    if (Post2Data) {
      console.log(Post2Data);
    }
  }, [Post2Data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100  p-10 ">
          <form className="space-y-10">
            <CreateGroupHeadderCard />
            <GeneralInfoCard Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} Icons={Icons} />
            <LayoutSetting Layout={Layout} setLayout={setLayout} ProductCard={ProductCard} setProductCard={setProductCard} IsMainGroup={IsMainGroup} setIsMainGroup={setIsMainGroup} />
            <PromotionalSlidersCard PromotionalSliders={PromotionalSliders} setPromotionalSliders={setPromotionalSliders} />
            <BannersCard Banners={Banners} setBanners={setBanners} />
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
};

export default create;
