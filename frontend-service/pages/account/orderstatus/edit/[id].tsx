import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import Spinner from "../../../../components/lib/Spinner";
import EditOrderStatusHeadderCard from "../../../../components/Account/orderstatus/edit/EditOrderStatusHeadderCard";
import GeneralInfoCard from "../../../../components/Account/orderstatus/edit/GeneralInfoCard";
import { OrderStatusType } from "../../../../types/OrderStatusType";
import usePutFetch from "../../../../custom_hooks/usePutFetch";

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
  const [orderstatus] = await Promise.all([fetch("http://nginx-proxy/shopping-service/orderstatus/" + id, { headers: { Authorization: cookies["jwt"] } }).then((res) => res.json())]);
  return {
    props: {
      orderstatus,
      InitialState: store.getState(),
    },
  };
};

function Edit({ orderstatus }: { orderstatus: OrderStatusType }) {
  const [Name, setName] = useState(orderstatus.Name || "");
  
  const [Role, setRole] = useState(orderstatus.Role || "");
  const [Type, setType] = useState(orderstatus.Type);
  const [Serial, setSerial] = useState(orderstatus.Serial);

  const [createEnable, setcreateEnable] = useState(false);
  const { data, IsPending, err, put } = usePutFetch();
  const router = useRouter();

  useEffect(() => {
    let en = false;
    if (Name && Role) {
      if (Name !== orderstatus.Name || Type !== orderstatus.Type || Role !== orderstatus.Role || Serial !== orderstatus.Serial) {
        en = true;
      }
    }
    setcreateEnable(en);
  }, [Name, Type, Role,Serial]);

  function createUploadUrl() {
    const payload: any = {};
    Type && (payload.Type = Type);
    payload.Serial = Serial;
    Name && (payload.Name = Name);
    Role && (payload.Role = Role);
    const id = router?.query?.id || "";
    put("/shopping-service/orderstatus/" + id, JSON.stringify(payload));
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
        <div className=" w-[calc(100%-260px)] relative bg-gray-100  p-10 ">
          {IsPending && <Spinner />}

          <form className=" space-y-10">
            <EditOrderStatusHeadderCard />
            <GeneralInfoCard Name={Name} Serial={Serial} setSerial={setSerial} Type={Type} Role={Role} setType={setType} setName={setName} setRole={setRole} />
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

export default Edit;
