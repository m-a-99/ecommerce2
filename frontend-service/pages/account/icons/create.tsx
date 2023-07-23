import { useEffect, useState } from "react";
import CreateIconHeadderCard from "../../../components/Account/icons/create/CreateIconHeadderCard";
import GeneralInfoCard from "../../../components/Account/icons/create/GeneralInfoCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import { GetServerSideProps } from "next";

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
  return {
    props: {
      InitialState: store.getState(),
    },
  };
};

function create() {
  const [Name, setName] = useState("");
  const [Icon, setIcon] = useState<File | null>(null);
  const [createEnable, setcreateEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, post: post2 } = usePostFetch();

  useEffect(() => {
    if (Name && Icon) {
      setcreateEnable(true);
    } else {
      setcreateEnable(false);
    }
  }, [Name, Icon]);

  function createUploadUrl() {
    get("/admin-service/icons/createuploadurl");
  }
  function createIcon(resdata: any) {
    const payload: any = {};
    Name && (payload.Name = Name);
    resdata.Icon && resdata.Icon[0] && (payload.Icon =resdata.Icon[0]);
    post2("/admin-service/icons/createicon", JSON.stringify(payload));
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
    if (post2data){
        console.log(post2data);
    };
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
            <CreateIconHeadderCard />
            <GeneralInfoCard Name={Name} setName={setName} Icon={Icon} setIcon={setIcon} />
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
