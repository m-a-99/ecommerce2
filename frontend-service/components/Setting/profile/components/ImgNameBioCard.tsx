import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks";
import { setUserInfoValue } from "../../../../Redux/userInfo";
import DragDrop from "../../../lib/DragDrop";
import Spinner from "../../../lib/Spinner";

const ImgNameBioCard = () => {
  const userInfo = useAppSelector((state) => state.userInfo.value);
  const [enSave, setenSave] = useState(false);
  const [ImgFile, setImgFile] = useState<File | null>(null);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Bio, setBio] = useState("");
  const [Img, setImg] = useState("");
  const { data: Getdata, IsPending: GetIsPending, err: Geterr, get: Get } = useGetFetch();
  const { data: Postdata, IsPending: IsPenPostding, err: Posterr, post: Post } = usePostFetch();
  const { data: Putdata, IsPending: IsPenPutding, err: Puterr, put: Put } = usePutFetch();
  const dispatch = useAppDispatch();
  useEffect(() => {
    setFirstName(userInfo.FirstName || "");
    setLastName(userInfo.LastName || "");
    setEmail(userInfo.Email || "");
    setBio(userInfo.Bio || "");
    setImg(userInfo.Img || "");
  }, [userInfo]);

  useEffect(() => {
    if (Getdata) {
      const formdata = new FormData();
      ImgFile && formdata.append("Img", ImgFile);
      console.log(Getdata)
      Post(Getdata.UploadUrl, formdata, "FormData");
    }
  }, [Getdata]);
  useEffect(() => {
    if (Postdata) {
      const payload: any = {};
      Postdata.Img && (payload.Img = Postdata.Img[0]);
      FirstName && (payload.FirstName = FirstName);
      LastName && (payload.LastName = LastName);
      Email && (payload.Email = Email);
      Bio && (payload.Bio = Bio);
      Put("/user-service/profile", JSON.stringify(payload));
    }
  }, [Postdata]);
  useEffect(() => {
    if (Putdata) {
      setImgFile(null);
      dispatch(setUserInfoValue(Putdata));
    }
  }, [Putdata]);
  useEffect(() => {
    if (FirstName === userInfo.FirstName && LastName === userInfo.LastName && Email === userInfo.Email && Bio === userInfo.Bio && !ImgFile) {
      setenSave(false);
    } else {
      setenSave(true);
    }
  }, [FirstName, LastName, Email, Bio, Img, ImgFile, userInfo]);

  useEffect(() => {
    Geterr && toast(Geterr.message,{type:"error"});
    Posterr && toast(Posterr.message,{type:"error"});
    Puterr && toast(Puterr.message,{type:"error"});
  }, [Geterr, Posterr, Puterr]);

  function save() {
    Get("/user-service/profile/createuploadurl");
  }

  return (
    <div className="relative bg-white drop-shadow-md rounded-md">
      {(GetIsPending || IsPenPostding || IsPenPutding) && <Spinner />}

      <div className="p-10 space-y-8">
        <DragDrop extentions="jpg,png" fileType="image" file={ImgFile} setfile={setImgFile} />
        <div className="space-y-2">
          <div>First Name</div>
          <div>
            <input onChange={(e) => setFirstName(e.target.value)} className="border-[2px] outline-none px-5 py-2 w-full  focus:border-blue-500 rounded-md" type="text" value={FirstName} />
          </div>
        </div>
        <div className="space-y-2">
          <div>Last Name</div>
          <div>
            <input onChange={(e) => setLastName(e.target.value)} className="border-[2px] outline-none px-5 py-2 w-full  focus:border-blue-500 rounded-md" type="text" value={LastName} />
          </div>
        </div>
        <div className="space-y-2">
          <div>Email</div>
          <div>
            <input onChange={(e) => setEmail(e.target.value)} className="border-[2px] outline-none px-5 py-2 w-full  focus:border-blue-500 rounded-md" type="text" value={Email} />
          </div>
        </div>
        <div className="space-y-2">
          <div>Bio</div>
          <div>
            <textarea onChange={(e) => setBio(e.target.value)} className="border-[2px] outline-none px-5 py-2 w-full  focus:border-blue-500 rounded-md" cols={30} rows={3} value={Bio}></textarea>
          </div>
        </div>
        <div className="flex justify-end">
          {enSave ? (
            <div onClick={save} className="py-2 px-5 cursor-pointer select-none rounded-lg bg-indigo-500  text-white w-min font-semibold">
              Save
            </div>
          ) : (
            <div className="py-2 px-5  select-none rounded-lg bg-gray-500  text-white w-min font-semibold">Save</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImgNameBioCard;
