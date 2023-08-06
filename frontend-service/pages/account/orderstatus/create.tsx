import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import { useEffect, useState } from "react";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import Headder from "../../../components/layout/headder";
import NavList from "../../../components/Account/NavList";
import CreateOrderStatusHeadderCard from "../../../components/Account/orderstatus/create/CreateOrderStatusHeadderCard";
import GeneralInfoCard from "../../../components/Account/orderstatus/create/GeneralInfoCard";
import { useRouter } from "next/router";
import Spinner from "../../../components/lib/Spinner";

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
  const [FailName, setFailName] = useState("");
  const [HasFail, setHasFail] = useState(false);
  const [Role, setRole] = useState("Admin");
  const [createEnable, setcreateEnable] = useState(false);
  const { data, IsPending, err, post } = usePostFetch();

  const router = useRouter();

  useEffect(() => {
    if (Name && Role && (!HasFail || (HasFail && FailName))) {
      setcreateEnable(true);
    } else {
      setcreateEnable(false);
    }
  }, [Name, Role]);

  function createUploadUrl() {
    const payload: any = {};
    payload.HasFail = HasFail;
    Name && (payload.Name = Name);
    Role && (payload.Role = Role);
    FailName && (payload.FailName = FailName);
    post("/shopping-service/orderstatus", JSON.stringify(payload));
  }

  useEffect(() => {
    if (data) {
      router.back();
    }
  }, [data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)]  relative bg-gray-100 p-10 ">
          {IsPending && <Spinner />}

          <form className=" space-y-10">
            <CreateOrderStatusHeadderCard />
            <GeneralInfoCard FailName={FailName} setFailName={setFailName} Name={Name} HasFail={HasFail} Role={Role} setHasFail={setHasFail} setName={setName} setRole={setRole} />
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
