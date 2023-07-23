import { useEffect, useState } from "react";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import EditTagHeadderCard from "../../../../components/Account/tags/edit/EditTagHeadderCard";
import GeneralInfoCard from "../../../../components/Account/tags/edit/GeneralInfoCard";
import { store } from "../../../../Redux/store";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { GroupsType } from "../../../../types/GroupsType";
import { IconsType } from "../../../../types/IconsType";
import { TagType, TagsType } from "../../../../types/TagsType";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";

export const getServerSideProps:GetServerSideProps= async (context) =>{
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
  const [Groups, Icons, Tag] = await Promise.all([fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/icons").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/tags/" + id).then((res) => res.json())]);
  return {
    props: {
      Groups,
      Icons,
      Tag,
      InitialState: store.getState(),
    },
  };
}
const create = ({ Groups, Icons, Tag }: { Groups: GroupsType; Icons: IconsType; Tag:TagType}) => {
  const [Icon, setIcon] = useState(Tag.Icon||"");
  const [Name, setName] = useState(Tag.Name||"");
  const [Details, setDetails] = useState(Tag.Details||"");
  const [Group, setGroup] = useState(""+Tag.Group||"");
  
  const router=useRouter();

  const [createEnable, setcreateEnable] = useState(false);

  const { data, IsPending, err, put } = usePutFetch();

  useEffect(() => {
    let en=false
    if (Icon && Name && Details && Group) {
      if(Icon!==Tag.Icon||Group!==""+Tag.Group||Details!==Tag.Details||Name!==Tag.Name){
        en=true
      }
    }
      setcreateEnable(en);
    
  }, [Icon, Name, Details, Group, createEnable]);

  function create() {
    const payload: any = {};
    Icon && (payload.Icon = Icon);
    Name && (payload.Name = Name);
    Details && (payload.Details = Details);
    Group && (payload.Group = Group);
    const id=router?.query?.id||""
    put("/admin-service/tags/"+id, JSON.stringify(payload));
  }
  useEffect(() => {
    if (data) {
      router.back()

    }
  }, [data]);
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <EditTagHeadderCard />
            <GeneralInfoCard Icons={Icons} Groups={Groups} Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} Details={Details} setDetails={setDetails} Group={Group} setGroup={setGroup} />

            {createEnable ? (
              <div onClick={create} className="flex justify-end">
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
};

export default create;
