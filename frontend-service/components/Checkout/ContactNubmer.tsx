import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import useDeleteFetch from "../../custom_hooks/useDeleteFetch";
import usePostFetch from "../../custom_hooks/usePostFetch";
import { useAppSelector } from "../../Redux/hooks";
import { setUserInfoValue } from "../../Redux/userInfo";
import ConfDelete from "../lib/ConfDelete";
import Spinner from "../lib/Spinner";

const ContactNubmer = () => {
  const userInfo = useAppSelector((state) => state.userInfo.value);

  const [addcontact, setaddcontact] = useState(false);
  const [addEnable, setaddEnable] = useState(false);
  const [Title, setTitle] = useState("");
  const [Value, setValue] = useState("");
  const { data, IsPending, err, post } = usePostFetch();
  const { data: deleteData, IsPending: deleteIsPending, err: deleteErr, Delete } = useDeleteFetch();
  const [DeleteEn, setDeleteEn] = useState(false);
  const [DeleteContactId, setDeleteContactId] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      setTitle("");
      setValue("");
      setaddcontact(false);
      dispatch(setUserInfoValue(data));
    }
  }, [data]);
  function add() {
    const payload: any = {};
    Title && (payload.Title = Title);
    Value && (payload.Value = Value);
    post("/user-service/profile/contact", JSON.stringify(payload));
  }

  useEffect(() => {
    if (Title.length > 0 && Value.length > 0) {
      setaddEnable(true);
    } else {
      setaddEnable(false);
    }
  }, [Title, Value]);

  function DeleteContactEnable(ContactId: string) {
    setDeleteContactId(ContactId);
    setDeleteEn(true)
  }
  function delete_contact(ContactId: string) {
    const payload: any = {};
    ContactId && (payload.ContactId = ContactId);
    Delete("/user-service/profile/contact", JSON.stringify(payload));
    setDeleteEn(false);
    setDeleteContactId("")
  }

  useEffect(() => {
    if (deleteData) {
      dispatch(setUserInfoValue(deleteData));
    }
  }, [deleteData]);

  useEffect(() => {
    if (err) {
      toast(err.message, { type: "error" });
    }
    if (deleteErr) {
      toast(deleteErr.message, { type: "error" });
    }
  }, [err, deleteErr]);

  return (
    <div>
      {addcontact ? (
        <div className="bg-white p-10 space-y-5 drop-shadow-md  rounded-md">
          {IsPending && <Spinner />}
          <div className="flex justify-between text-zinc-600 text-lg font-semibold">
            <div>Add Contact Value</div>
            <div
              onClick={() => {
                setaddcontact(false);
              }}
            >
              <i className="text-red-500  text-2xl far fa-circle-xmark"></i>
            </div>
          </div>
          <div className="flex space-x-2">
            <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-blue-500 rounded-md" type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={Title} />
            <input className="border-[2px] outline-none px-5 py-2 w-full  focus:border-blue-500 rounded-md" type="text" placeholder="Value" onChange={(e) => setValue(e.target.value)} value={Value} />
          </div>
          <div className="flex justify-end">
            {addEnable ? (
              <div onClick={add} className="py-2 px-5 cursor-pointer select-none rounded-lg bg-indigo-500  text-white w-min font-semibold ">
                Add
              </div>
            ) : (
              <div className="py-2 px-5  select-none rounded-lg bg-gray-500  text-white w-min font-semibold">Add</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 space-y-5 drop-shadow-md  rounded-md">
          {DeleteEn && <ConfDelete Cancel={() => setDeleteEn(false)} Delete={() => delete_contact(DeleteContactId)} />}

          <div className="flex justify-between">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex justify-center items-center text-white ">1</div>
              <div className="text-xl">Contacts</div>
            </div>
            <div
              onClick={() => {
                setaddcontact(true);
              }}
              className=" cursor-pointer select-none flex  font-semibold text-indigo-500 "
            >
              + Add
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start lg:justify-start">
            {userInfo?.Contacts &&
              userInfo?.Contacts.map((e) => (
                <div className=" max-w-[250px] min-w-[150px] space-y-2 rounded-xl bg-gray-100  p-5 text-sm" key={e._id}>
                  <div className="flex justify-between ">
                    <div className="font-bold text-zinc-800">
                      {e?.Title &&
                        e.Title.split(" ").reduce((pre, cur) => {
                          return pre + " " + cur.charAt(0).toUpperCase() + cur.substring(1);
                        }, "")}
                    </div>
                    <div onClick={() => e._id && DeleteContactEnable(e._id)} className="text-red-500 cursor-pointer select-none">
                      <i className="fa-solid fa-trash-xmark"></i>
                    </div>
                  </div>
                  <div>{e.Value}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactNubmer;
