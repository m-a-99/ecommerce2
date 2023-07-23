import { useEffect, useState } from "react";
import CreateTagHeadderCard from "../../../components/Account/categories/create/CreateCategoryHeadderCard";
import NavList from "../../../components/Account/NavList";
import GeneralInfoCard from "../../../components/Account/tags/create/GeneralInfoCard";
import Headder from "../../../components/layout/headder";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { store } from "../../../Redux/store";
import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
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
  const [Groups, Icons] = await Promise.all([fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()), fetch("http://nginx-proxy/admin-service/icons").then((res) => res.json())]);
  return {
    props: {
      Groups,
      Icons,
      InitialState: store.getState(),
    },
  };
};

const create = ({ Groups, Icons }: any) => {
  const [Icon, setIcon] = useState("");
  const [Name, setName] = useState("");
  const [Details, setDetails] = useState("");
  const [Group, setGroup] = useState("");

  const [createEnable, setcreateEnable] = useState(false);

  const { data, IsPending, err, post } = usePostFetch();

  useEffect(() => {
    if (Icon && Name && Details && Group) {
      setcreateEnable(true);
    } else {
      setcreateEnable(false);
    }
  }, [Icon, Name, Details, Group, createEnable]);

  function create() {
    const payload:any = {};
    Icon&&(payload.Icon=Icon)
    Name&&(payload.Name=Name)
    Details&&(payload.Details=Details)
    Group&&(payload.Group=Group)
    post("/admin-service/tags/createtag", JSON.stringify(payload));
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
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <CreateTagHeadderCard />
            <GeneralInfoCard Icons={Icons} Groups={Groups} Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} Details={Details} setDetails={setDetails} Group={Group} setGroup={setGroup} />

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
