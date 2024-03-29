import { useEffect, useState } from "react";
import NavList from "../../../components/Account/NavList";
import CreateSocialMediaPlatformsHeadderCard from "../../../components/Account/socialmediaplatforms/create/CreateSocialMediaPlatformsHeadderCard";
import GeneralInfoCard from "../../../components/Account/socialmediaplatforms/create/GeneralInfoCard";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";


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
    get("/admin-service/socialmediaplatforms/createuploadurl");
  }
  function createIcon(resdata: any) {
    const payload: any = {};
    Name && (payload.Name = Name);
    resdata.Icon && resdata.Icon[0] && (payload.Icon = resdata.Icon[0]);
    post2("/admin-service/socialmediaplatforms/createsocialmediaplatform", JSON.stringify(payload));
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
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100  p-10 ">
          <form className="space-y-10">
            <CreateSocialMediaPlatformsHeadderCard />
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
