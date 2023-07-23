import { useEffect, useState } from "react";
import CreateAuthorsHeadderCard from "../../../components/Account/authers/create/CreateAuthorsHeadderCard";
import GeneralInfoCard from "../../../components/Account/authers/create/GeneralInfoCard";
import ImageCard from "../../../components/Account/authers/create/ImageCard";
import SocialProfilesCard from "../../../components/Account/authers/create/SocialProfilesCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { SocialProfilesType } from "../../../types/SotialProfilesType";
import { store } from "../../../Redux/store";
import { GetServerSideProps } from "next";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { ParseCookies } from "../../../utils/ParseCookies";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Admin" && store.getState().userInfo.value?.AccountType !== "Seller") {
    return {
      notFound: true,
    };
  }
  const id = context?.params?.id || "";
  const [SocialMediaPlatforms] = await Promise.all([fetch("http://nginx-proxy/admin-service/socialmediaplatforms").then((res) => res.json())]);
  return {
    props: {
      SocialMediaPlatforms,
      InitialState: store.getState(),
    },
  };
};


function create({ Groups, SocialMediaPlatforms }: any) {
  const [Name, setName] = useState("");
  const [Languages, setLanguages] = useState("");
  const [Bio, setBio] = useState("");
  const [Quote, setQuote] = useState("");
  const [Born, setBorn] = useState("");
  const [Death, setDeath] = useState("");

  const [SocialProfiles, setSocialProfiles] = useState<SocialProfilesType>([]);
  const [Image, setImage] = useState<File | null>(null);


  const [createEnable, setcreateEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, post: post2 } = usePostFetch();

  useEffect(() => {
    if (Name) {
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
  }, [Name,SocialProfiles]);

  function createUploadUrl() {
    get("/shops-service/authors/createuploadurl");
  }
  function create(resdata: any) {
    const payload: any = {};
    Name&&(payload.Name=Name);
    Languages&&(payload.Languages=Languages);
    Bio&&(payload.Bio=Bio);
    Quote&&(payload.Quote=Quote);
    Born&&(payload.Born=Born);
    Death&&(payload.Death=Death);
    resdata.Image && resdata.Image[0] && (payload.Image = resdata.Image[0]);
    SocialProfiles.length > 0 && (payload.SocialProfiles = SocialProfiles);

    post2("/shops-service/authors/createauthor", JSON.stringify(payload));
  }

  useEffect(() => {
    if (Getdata) {
      const formdata = new FormData();
      Image && formdata.append("Image", Image);
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
            <CreateAuthorsHeadderCard />
            <ImageCard Image={Image} setImage={setImage} />
            <GeneralInfoCard Name={Name} setName={setName} Languages={Languages} setLanguages={setLanguages} Bio={Bio} setBio={setBio} Quote={Quote} setQuote={setQuote} Born={Born} setBorn={setBorn} Death={Death} setDeath={setDeath} />
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
