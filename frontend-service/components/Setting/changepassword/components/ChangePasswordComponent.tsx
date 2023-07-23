import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Spinner from "../../../lib/Spinner";

const ChangePasswordComponent = () => {
  const [showOldPassword, setshowOldPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [showConfirmationPassword, setshowConfirmationPassword] = useState(false);
  const [OldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmationPassword, setConfirmationPassword] = useState("");

  const [SaveEnable, setSaveEnable] = useState(false);

  const { data, IsPending, err, post } = usePostFetch();
  useEffect(() => {
    if (data) {
      toast(data.message, { type: "success" });
      setOldPassword("")
      setNewPassword("")
      setConfirmationPassword("")
    }
  }, [data]);

  useEffect(() => {
    if (err) {
      toast(err.message, { type: "error" });
    }
  }, [err]);

  useEffect(() => {
    if (OldPassword && NewPassword && ConfirmationPassword && NewPassword.length >= 6 && NewPassword === ConfirmationPassword) {
      setSaveEnable(true);
    } else {
      setSaveEnable(false);
    }
  }, [OldPassword, NewPassword, ConfirmationPassword]);

  function save() {
    const payload: any = {};
    OldPassword && (payload.OldPassword = OldPassword);
    NewPassword && (payload.NewPassword = NewPassword);
    ConfirmationPassword && (payload.ConfirmationPassword = ConfirmationPassword);
    post("/user-service/changepassword", JSON.stringify(payload));
  }

  return (
    <div className="relative bg-white p-10 space-y-5 drop-shadow-md  rounded-md">
      {IsPending && <Spinner />}
      <div className="space-y-2">
        <div className="text-zinc-600 text-lg font-semibold">Old Password</div>
        <div className="relative">
          <input
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            value={OldPassword}
            className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md"
            type={showOldPassword ? "text" : "password"}
          />
          <div onClick={() => setshowOldPassword((v) => !v)} className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2">
            <i className={`far text-zinc-700 text-lg ${showOldPassword ? "fa-eye-slash" : "fa-eye"} `}></i>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-zinc-600 text-lg font-semibold">New Password</div>
        <div className="relative">
          <input
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            value={NewPassword}
            className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md"
            type={showNewPassword ? "text" : "password"}
          />
          <div onClick={() => setshowNewPassword((v) => !v)} className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2">
            <i className={`far text-zinc-700 text-lg ${showNewPassword ? "fa-eye-slash" : "fa-eye"} `}></i>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-zinc-600 text-lg font-semibold">Confirm Password</div>
        <div className="relative">
          <input
            onChange={(e) => {
              setConfirmationPassword(e.target.value);
            }}
            value={ConfirmationPassword}
            className="border-[2px] outline-none px-5 py-2 w-full  focus:border-indigo-500 rounded-md"
            type={showConfirmationPassword ? "text" : "password"}
          />
          <div onClick={() => setshowConfirmationPassword((v) => !v)} className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2">
            <i className={`far text-zinc-700 text-lg ${showConfirmationPassword ? "fa-eye-slash" : "fa-eye"} `}></i>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-5">
        {SaveEnable ? (
          <div onClick={save} className="py-2 px-5 cursor-pointer select-none rounded-lg bg-indigo-500  text-white w-min font-semibold ">
            Save
          </div>
        ) : (
          <div className="py-2 px-5  select-none rounded-lg bg-gray-500  text-white w-min font-semibold ">Save</div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordComponent;
