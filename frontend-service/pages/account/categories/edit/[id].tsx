import { useEffect, useState } from "react";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import GeneralInfoCard from "../../../../components/Account/categories/edit/GeneralInfoCard";
import EditCategoryHeadderCard from "../../../../components/Account/categories/edit/EditCategoryHeadderCard";
import { GetServerSideProps } from "next";
import { store } from "../../../../Redux/store";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { GroupsType } from "../../../../types/GroupsType";
import { IconsType } from "../../../../types/IconsType";
import { CategoriesType, CategoryType, SubCategoryType } from "../../../../types/CategoriesType";
import SubCategoriesCard from "../../../../components/Account/categories/edit/SubCategoriesCard";
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
  const id=context?.params?.id||"";
  const [Groups, Icons, Categories,Category] = await Promise.all([fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/icons").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/categories").then((res) => res.json()),fetch("http://nginx-proxy/admin-service/categories/"+id).then(res=>res.json())]);
  return {
    props: {
      Groups,
      Icons,
      Categories,
      Category,
      InitialState: store.getState(),
    },
  };
};
const save = ({ Groups, Icons, Categories,Category }: {Groups:GroupsType, Icons:IconsType, Categories:CategoriesType,Category:CategoryType}) => {
  const [Icon, setIcon] = useState(Category.Icon);
  const [Name, setName] = useState(Category.Name);
  const [Details, setDetails] = useState(Category.Details);
  const [Group, setGroup] = useState(""+Category.Group);
  const [SubCategories, setSubCategories] = useState<SubCategoryType[]>(structuredClone(Category.SubCategories )|| []);
  const [saveEnable, setsaveEnable] = useState(false);
  const [DeletedSubCategoriesIds, setDeletedSubCategoriesIds] = useState<string[]>([]);

  const router =useRouter();

  const { data, IsPending, err, put } = usePutFetch();

  useEffect(() => {
    let en=false
    if (Icon &&Name && Details && Group) {
      if(Icon!==Category.Icon||Name!==Category.Name||Details!==Category.Details||Group!==(Category.Group) as any){
        en=true;
      }
      if(SubCategories.length===Category.SubCategories.length){
        let tmp:{[key:string]:SubCategoryType}={}
        Category.SubCategories.forEach((v) => (tmp[v._id] = v))
        SubCategories.forEach(v=>{
          if(tmp[v._id].Name!==v.Name||tmp[v._id].Details!==v.Details||tmp[v._id].Icon!==v.Icon){
            en=true;
          }
        });
      }
      else{
        en=true
      }
    }
    setsaveEnable(en)
  }, [Icon, Name, Details, Group,DeletedSubCategoriesIds,SubCategories]);

  function save() {
    const payload: any = {};
    Icon && (payload.Icon = Icon);
    Name && (payload.Name = Name);
    Details && (payload.Details = Details);
    Group && (payload.Group = Group);
    SubCategories && (payload.SubCategories = SubCategories);
    DeletedSubCategoriesIds && (payload.DeletedSubCategoriesIds = DeletedSubCategoriesIds);
    const id=router?.query?.id||""
    put("/admin-service/categories/" + id, JSON.stringify(payload));
    
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
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100  p-10 ">
          <form className="space-y-10">
            <EditCategoryHeadderCard />
            <GeneralInfoCard Categories={Categories} Icons={Icons} Groups={Groups} Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} Details={Details} setDetails={setDetails} Group={Group} setGroup={setGroup} />
            <SubCategoriesCard setDeletedSubCategoriesIds={setDeletedSubCategoriesIds} Icons={Icons} SubCategories={SubCategories} setSubCategories={setSubCategories} />
            {saveEnable ? (
              <div onClick={save} className="flex justify-end">
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

export default save;
