import { useEffect, useState } from "react";
import { SocialMediaPlatformsType, SocialProfilesType } from "../../../../types/SotialProfilesType";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import EditAuthorsHeadderCard from "../../../../components/Account/authers/edit/EditAuthorsHeadderCard";
import ImageCard from "../../../../components/Account/authers/edit/ImageCard";
import GeneralInfoCard from "../../../../components/Account/authers/edit/GeneralInfoCard";
import SocialProfilesCard from "../../../../components/Account/authers/edit/SocialProfilesCard";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import { AutherType } from "../../../../types/AuthersType";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Admin" && store.getState().userInfo.value?.AccountType !== "Seller") {
    return {
      notFound: true,
    };
  }
  const id = context?.params?.id || "";
  const [SocialMediaPlatforms, Author] = await Promise.all([fetch("http://nginx-proxy/admin-service/socialmediaplatforms").then((res) => res.json()), fetch("http://nginx-proxy/shops-service/authors/" + id).then((res) => res.json())]);
  return {
    props: {
      SocialMediaPlatforms,
      Author,
      InitialState: store.getState(),
    },
  };
};

function Edit({ SocialMediaPlatforms, Author }: { SocialMediaPlatforms: SocialMediaPlatformsType; Author: AutherType }) {
  const [Name, setName] = useState(Author.Name || "");
  const [Languages, setLanguages] = useState(Author.Languages || "");
  const [Bio, setBio] = useState(Author.Bio || "");
  const [Quote, setQuote] = useState(Author.Quote || "");
  const [Born, setBorn] = useState(Author.Born || "");
  const [Death, setDeath] = useState(Author.Death || "");

  const [DeletedSocialProfilesIds, setDeletedSocialProfilesIds] = useState<string[]>([]);

  const [SocialProfiles, setSocialProfiles] = useState<SocialProfilesType>([]);
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const [ImageSrc, setImageSrc] = useState("http://nginx-proxy/" + Author.Image || "");

  const [SaveEnable, setSaveEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, put } = usePutFetch();

  const router = useRouter();

  useEffect(() => {
    if (Array.isArray(Author.SocialProfiles)) {
      const tmp: SocialProfilesType = [];
      Author.SocialProfiles.forEach((profile) => {
        tmp.push({ Key: profile._id, _id: profile._id, SocialMediaPlatform: profile.SocialMediaPlatform._id, Url: profile.Url });
      });
      setSocialProfiles(tmp);
    }
  }, [Author]);

  // useEffect(() => {
  //   if (Name) {
  //     let check = true;
  //     if (SocialProfiles.length > 0) {
  //       for (let i = 0; i < SocialProfiles.length; i++) {
  //         if (!(SocialProfiles[i].SocialMediaPlatform && SocialProfiles[i].Url)) {
  //           check = false;
  //           break;
  //         }
  //       }
  //     }
  //     if (check) setSaveEnable(true);
  //     else {
  //       setSaveEnable(false);
  //     }
  //   } else {
  //     setSaveEnable(false);
  //   }
  // }, [Name, SocialProfiles]);

  useEffect(() => {
    let en = false;
    if (Name && (Image || Author.Image)) {
      if (Name !== Author.Name || Languages !== Author.Languages || Bio !== Author.Bio || Quote !== Author.Quote || Born !== Author.Born || Death !== Author.Death || ImageFile) {
        en = true;
      }
      const tmp: any = {};
      (Author?.SocialProfiles || []).forEach((profile) => {
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
    setSaveEnable(en);
  }, [Name, Bio, Quote, ImageFile, Languages, Born, Death, SocialProfiles, DeletedSocialProfilesIds]);

  function createUploadUrl() {
    get("/shops-service/authors/createuploadurl");
  }

  function create(resdata: any) {
    const payload: any = {};
    Name && (payload.Name = Name);
    Languages && (payload.Languages = Languages);
    Bio && (payload.Bio = Bio);
    Quote && (payload.Quote = Quote);
    Born && (payload.Born = Born);
    Death && (payload.Death = Death);
    resdata.Image && resdata.Image[0] && (payload.Image = resdata.Image[0]);
    resdata.CoverImage && resdata.CoverImage[0] && (payload.CoverImage = resdata.CoverImage[0]);
    SocialProfiles.length > 0 && (payload.SocialProfiles = SocialProfiles);
    DeletedSocialProfilesIds.length > 0 && (payload.DeletedSocialProfilesIds = DeletedSocialProfilesIds);
    const id = router?.query?.id || "";
    put("/shops-service/authors/" + id, JSON.stringify(payload));
  }

  useEffect(() => {
    if (Getdata) {
      const formdata = new FormData();
      ImageFile && formdata.append("Image", ImageFile);
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

  // useEffect(()=>{
  //   if(ImageFile){
  //     setImageSrc(URL.createObjectURL(ImageFile));
  //   }
  // },[ImageFile])

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <EditAuthorsHeadderCard />
            <ImageCard ImageSrc={ImageSrc} ImageFile={ImageFile} setImageFile={setImageFile} />
            <GeneralInfoCard Name={Name} setName={setName} Languages={Languages} setLanguages={setLanguages} Bio={Bio} setBio={setBio} Quote={Quote} setQuote={setQuote} Born={Born} setBorn={setBorn} Death={Death} setDeath={setDeath} />
            <SocialProfilesCard setDeletedSocialProfilesIds={setDeletedSocialProfilesIds} SocialMediaPlatforms={SocialMediaPlatforms} SocialProfiles={SocialProfiles} setSocialProfiles={setSocialProfiles} />
            {SaveEnable ? (
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

export default Edit;
