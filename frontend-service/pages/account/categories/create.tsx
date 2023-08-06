import { useEffect, useState } from "react";
import CreateCategoryHeadderCard from "../../../components/Account/categories/create/CreateCategoryHeadderCard";
import GeneralInfoCard from "../../../components/Account/categories/create/GeneralInfoCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
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
  const [Groups,Icons,Categories] = await Promise.all([ fetch("http://nginx-proxy/admin-service/groups").then(res=>res.json()),fetch("http://nginx-proxy/admin-service/icons").then(res=>res.json()),fetch("http://nginx-proxy/admin-service/categories").then(res=>res.json())]);
  return {
    props: {
      Groups,
      Icons,
      Categories,
      InitialState: store.getState(),
    },
  };
};

const create = ({ Groups, Icons, Categories }: any) => {
  const [Icon, setIcon] = useState("");
  const [Name, setName] = useState("");
  const [Details, setDetails] = useState("");
  const [IsChildCategory, setIsChildCategory] = useState(false);
  const [Group, setGroup] = useState("");
  const [ParentCategory, setParentCategory] = useState("");

  const [createEnable, setcreateEnable] = useState(false);

  const { data, IsPending, err, post } = usePostFetch();

  useEffect(() => {
    if (Icon && Name && Details && ((!IsChildCategory && Group) || (IsChildCategory && ParentCategory))) {
      setcreateEnable(true);
    } else {
      setcreateEnable(false);
    }
  }, [Icon, Name, Details, IsChildCategory, Group, ParentCategory, createEnable]);

  function create() {
    const payload:any = {};
    Icon&&(payload.Icon=Icon)
    Name&&(payload.Name=Name)
    Details&&(payload.Details=Details)
    IsChildCategory&&(payload.IsChildCategory=IsChildCategory)
    Group&&(payload.Group=Group)
    ParentCategory&&(payload.ParentCategory=ParentCategory)
    post("/admin-service/categories/createcategory", JSON.stringify(payload));
  }
  useEffect(()=>{
    if(data){
      console.log(data)
    }
  },[data])
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100   p-10 ">
          <form className="space-y-10">
            <CreateCategoryHeadderCard />
            <GeneralInfoCard Categories={Categories} ParentCategory={ParentCategory} setParentCategory={setParentCategory} IsChildCategory={IsChildCategory} setIsChildCategory={setIsChildCategory} Icons={Icons} Groups={Groups} Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} Details={Details} setDetails={setDetails} Group={Group} setGroup={setGroup} />

            {createEnable ? (
              <div onClick={create} className="flex justify-end">
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
