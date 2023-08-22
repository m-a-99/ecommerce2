import Link from "next/link";
import DropList from "../../lib/DropList";
import { UserInfoType } from "../../../types/UserInfoType";
type props = {
  Role: string;
  setRole: (v: string) => void;
};
function UsersHeadder({  Role, setRole }: props) {
  return (
    <div className="py-8 px-10 bg-white h-min w-full shadow-md rounded-md flex gap-5 items-center justify-between">
      <span className="text-zinc-700 font-semibold text-lg w-[10%]">Users</span>
      <div className="w-[45%]">
        <form className="w-full relative">
          <i className="absolute far text-zinc-500 fa-magnifying-glass left-4 top-1/2 -translate-y-1/2"></i>
          <input className="outline-none rounded-full  w-full border-[2px] border-zinc-300 px-10 text-zinc-800 font- py-3" type="text" placeholder="Search Shops" />
        </form>
      </div>
      <div className="w-[18%]">
        <DropList
          List={[
            { Id: "Client", Name: "Client" },
            { Id: "Seller", Name: "Seller" },
            { Id: "SubSeller", Name: "SubSeller" },
            { Id: "SubAdmin", Name: "SubAdmin" },
          ]}
          Value={Role}
          setValue={setRole}
        />
      </div>
      <div className="w-[20%] flex justify-end text-center">
        <Link className="w-full" href={"/account/users/create"}>
          <div className="w-full space-x-1 cursor-pointer select-none hover:bg-indigo-600 text-white bg-indigo-500 p-2 px-5  rounded-full">
            <i className="fa-solid fa-plus"></i>
            <span>New SubAdmin</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default UsersHeadder