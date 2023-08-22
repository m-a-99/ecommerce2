import CreateUserHeadderCard from "../../../components/Account/users/create/CreateUserHeadderCard";
import { useEffect, useState } from "react";
import GeneralInfoCard from "../../../components/Account/icons/create/GeneralInfoCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import { GetServerSideProps } from "next";
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
  return {
    props: {
      InitialState: store.getState(),
    },
  };
};

function create() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Img, setImg] = useState<File | null>(null);
  const [createEnable, setcreateEnable] = useState(false);
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: post1data, IsPending: post1IsPending, err: post1err, post: post1 } = usePostFetch();
  const { data: post2data, IsPending: post2IsPending, err: post2err, post: post2 } = usePostFetch();
  const router =useRouter()

  useEffect(() => {
    let en = false;
    if (FirstName && LastName && Email && Password.length >= 8 && Img) {
      en = true;
    }
    setcreateEnable(en);
  }, [FirstName, LastName, Email, Password, Img]);

  function createUploadUrl() {
    get("/user-service/profile/createuploadurl");
  }
  
  function AddUser(resdata: any) {
    const payload: any = {};
    FirstName && (payload.FirstName = FirstName);
    LastName && (payload.LastName = LastName);
    Email && (payload.Email = Email);
    Password && (payload.Password = Password);
    resdata.Img && resdata.Img[0] && (payload.Img = resdata.Img[0]);
    post2("/user-service/user/addsubadmin", JSON.stringify(payload));
  }

  useEffect(() => {
    if (Getdata) {
      const formdata = new FormData();
      Img && formdata.append("Img", Img);
      post1(Getdata.UploadUrl, formdata, "formdata");
    }
  }, [Getdata]);

  useEffect(() => {
    if (post1data) {
      AddUser(post1data);
    }
  }, [post1data]);

  useEffect(() => {
    if (post2data) {
      // console.log(post2data);
      router.back();
    }
  }, [post2data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100  p-10 ">
          <form className="space-y-10">
            <CreateUserHeadderCard />
            <GeneralInfoCard FirstName={FirstName} setFirstName={setFirstName} LastName={LastName} setLastName={setLastName} Email={Email} setEmail={setEmail} Password={Password} setPassword={setPassword} Img={Img} setImg={setImg} />
            {createEnable ? (
              <div onClick={createUploadUrl} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">create</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5 drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">create</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default create;
