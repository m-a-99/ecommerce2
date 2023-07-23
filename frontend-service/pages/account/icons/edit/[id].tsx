import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import { useEffect, useState } from "react";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import EditIconHeadderCard from "../../../../components/Account/icons/edit/EditIconHeadderCard";
import GeneralInfoCard from "../../../../components/Account/icons/edit/GeneralInfoCard";
import { IconType } from "../../../../types/IconsType";
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
  const id = context?.query?.id || "";
  const resdata = await fetch("http://nginx-proxy/admin-service/icons/" + id);
  const icon = await resdata.json();
  return {
    props: {
      icon,
      InitialState: store.getState(),
    },
  };
};

function create({icon}:{icon:IconType}) {
  const [Name, setName] = useState(icon.Name||"");
  const [IconSrc, setIconSrc]=useState(icon.Url);
  const [Icon, setIcon] = useState<File | null>(null);
  const [createEnable, setcreateEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, put } = usePutFetch();

  const router=useRouter()
  useEffect(() => {
    let en=false;
    if (Name && (Icon||IconSrc)) {
     if(Name!==icon.Name||Icon){
        en=true
     }
    }
    setcreateEnable(en)
  }, [Name, Icon]);

  function createUploadUrl() {
    get("/admin-service/icons/createuploadurl");
  }
  function createIcon(resdata: any) {
    const payload: any = {};
    Name && (payload.Name = Name);
    resdata.Icon && resdata.Icon[0] && (payload.Icon = resdata.Icon[0]);
    const id=router?.query?.id||""
    put("/admin-service/icons/"+id, JSON.stringify(payload));
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
        router.back(); 
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
            <EditIconHeadderCard />
            <GeneralInfoCard Name={Name} setName={setName} IconSrc={IconSrc} Icon={Icon} setIcon={setIcon} />
            {createEnable ? (
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
