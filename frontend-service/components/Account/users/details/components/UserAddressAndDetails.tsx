import { useEffect, useState } from "react";
import { UserInfoType } from "../../../../../types/UserInfoType";
import DropList from "../../../../lib/DropList";
import usePutFetch from "../../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";

type props = {
  User: UserInfoType;
};

const UserAddressAndDetails = ({ User }: props) => {
  const [AccountStatusState, setAccountStatusState]=useState(User.Status);
  const [AccountState, setAccountState] = useState(User.Status);
  const [ShowMsgLog, setShowMsgLog] = useState(false);
  const [MsgLog, setMsgLog]=useState(User.MessageLog);
  const [msg, setmsg] = useState("");
  const [SaveEn, setSaveEn] = useState(false);
  const {data,IsPending,err,put} = usePutFetch();
  const router=useRouter()

  useEffect(() => {
    let en = false;
    if (AccountState !== AccountStatusState || msg) {
      en = true;
    }
    setSaveEn(en);
  }, [AccountState, AccountStatusState, msg]);

  useEffect(()=>{
    if(data){
      console.log(data)
      setAccountState(data.Status);
      setAccountStatusState(data.Status);
      setMsgLog(data.MessageLog);
      setmsg("");
    }
  },[data])

  function save(){
    const payload:any={};
    AccountState && (payload.Status = AccountState);
    msg && (payload.Message = msg);
    const id=router?.query?.id||""
    put("/user-service/user/status/" + id, JSON.stringify(payload));
  }
  return (
    <div className="p-5  bg-white grid grid-cols-12 border-b-[1px] gap-5 border-gray-300 ">
      <div className="col-span-3 border-r-[1px] space-y-2  border-gray-300">
        <div>
          <div className="font-semibold text-zinc-700 ">Client Info</div>
          <div className="text-sm text-gray-500">
            <div className="text-sm text-gray-500">
              <div className="text-gray-500 font-semibold truncate ">Id :</div>
              <div className="truncate">{User._id}</div>
              <div className="text-gray-500 font-semibold truncate ">Name :</div>
              <div className="truncate">{User?.FirstName + " " + User?.LastName}</div>
              <div className="text-gray-500 font-semibold truncate ">Email :</div>
              <div className="truncate">{User?.Email}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4 border-r-[1px] space-y-2  border-gray-300">
        <div>
          <div className="font-semibold text-zinc-700 ">Shipping Address</div>
          <div className="text-sm text-gray-500">
            <div>{User.ShippingAddress?.Title}</div>
            <div>{User.ShippingAddress?.StreetAddress}</div>
            <div>{`${User.ShippingAddress?.City} , ${User.ShippingAddress?.State} , ${User.ShippingAddress?.Zip} , ${User.ShippingAddress?.Country}`}</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-zinc-700 "> Billing Address </div>
          <div className="text-sm text-gray-500">
            <div>{User.BillingAddress?.Title}</div>
            <div>{User.BillingAddress?.StreetAddress}</div>
            <div>{`${User.BillingAddress?.City} , ${User.BillingAddress?.State} , ${User.BillingAddress?.Zip} , ${User.ShippingAddress?.Country}`}</div>
          </div>
        </div>
      </div>
      <div className="col-span-2 space-y-2  border-r-[1px] border-gray-300">
        <div>
          <div className="font-semibold text-zinc-700 ">Contacts</div>
          <div className="pr-2">
            <div className="space-y-3 overflow-y-auto customscrollbar max-h-[200px]">
              {(User?.Contacts || []).map((contact) => (
                <div className="text-sm text-gray-500" key={contact._id}>
                  <div className="text-gray-500 font-semibold truncate ">{contact?.Title}</div>
                  <div className="truncate">{contact.Value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 space-y-2 ">
        <div className="font-semibold text-zinc-700 ">Account Status</div>
        <div className="text-gray-500 font-semibold truncate text-sm ">Status :</div>
        <div>
          <DropList
            List={[
              { Id: "Active", Name: "Active" },
              { Id: "Banned", Name: "Banned" },
            ]}
            Value={AccountState}
            setValue={setAccountState}
          />
        </div>
        <div className="text-gray-500 font-semibold truncate text-sm ">Message :</div>
        <div className="w-full rounded-md flex items-center justify-center p-1 border border-gray-400 ">
          <textarea
            value={msg}
            onChange={(e) => {
              setmsg(e.target.value);
            }}
            className="outline-none  w-full h-16 customscrollbar resize-none"
          ></textarea>
        </div>
        <div>
          <div className="flex items-center gap-1 text-gray-600">
            <input checked={ShowMsgLog} onChange={(e) => setShowMsgLog(e.target.checked)} type="checkbox" className="w-4 h-4" />
            <div>Show Message Log</div>
          </div>
        </div>
        {ShowMsgLog && (
          <div className="h-[150px] p-2 border border-gray-400 rounded  text-gray-500 text-md">
            <div className=" h-full overflow-y-scroll customscrollbar  w-full  ">
              <pre className="w-full text-sm  whitespace-pre-line">{MsgLog}</pre>
            </div>
          </div>
        )}
        <div className="w-full flex justify-center">{SaveEn ? <div onClick={save} className="h-10 w-20 bg-indigo-500 cursor-pointer select-none rounded-md flex justify-center text-white items-center">Save</div> : <div className="h-10 w-20 bg-indigo-300 rounded-md select-none flex justify-center text-white items-center">Save</div>}</div>
      </div>
    </div>
  );
};

export default UserAddressAndDetails;
