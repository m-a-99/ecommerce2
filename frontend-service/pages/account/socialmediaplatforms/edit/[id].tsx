import { useEffect, useState } from "react";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import EditSocialMediaPlatformsHeadderCard from "../../../../components/Account/socialmediaplatforms/edit/EditSocialMediaPlatformsHeadderCard";
import GeneralInfoCard from "../../../../components/Account/socialmediaplatforms/edit/GeneralInfoCard";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { store } from "../../../../Redux/store";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { SocialMediaPlatformType, SocialMediaPlatformsType } from "../../../../types/SotialProfilesType";
import { GetServerSideProps } from "next";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Admin") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
  const id = context?.params?.id || "";
  const resData = await fetch("http://nginx-proxy/admin-service/socialmediaplatforms/" + id);
  const SocialMediaPlatform = await resData.json();
  return {
    props: {
      SocialMediaPlatform,
      InitialState: store.getState(),
    },
  };
};

function create({ SocialMediaPlatform }: { SocialMediaPlatform: SocialMediaPlatformType }) {
  const [Name, setName] = useState(SocialMediaPlatform.Name);
  const [Icon, setIcon] = useState<File | null>(null);
  const [IconSrc, setIconSrc] = useState(SocialMediaPlatform.Icon);
  const [saveEnable, setsaveEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, put } = usePutFetch();
  const router = useRouter();
  useEffect(() => {
    let en = false;
    if (Name && (Icon || IconSrc)) {
      if (Name !== SocialMediaPlatform.Name || Icon) {
        en = true;
      }
    }
    setsaveEnable(en);
  }, [Name, Icon]);

  function createUploadUrl() {
    get("/admin-service/socialmediaplatforms/createuploadurl");
  }
  function createIcon(resdata: any) {
    const payload: any = {};
    Name && (payload.Name = Name);
    resdata.Icon && resdata.Icon[0] && (payload.Icon = resdata.Icon[0]);
    const id = router?.query?.id || "";
    put("/admin-service/socialmediaplatforms/" + id, JSON.stringify(payload));
  }

  useEffect(() => {
    if (Getdata) {
      const formdata = new FormData();
      Icon && formdata.append("Icon", Icon);
      post1(Getdata.UploadUrl, formdata, "formdata");
    }
  }, [Getdata]);

  useEffect(() => {
    if (post1data) {
      createIcon(post1data);
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
            <EditSocialMediaPlatformsHeadderCard />
            <GeneralInfoCard IconSrc={IconSrc} Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} />
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
