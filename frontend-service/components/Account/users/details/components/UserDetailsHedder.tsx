import { useEffect, useState } from "react";
import { OrdersType } from "../../../../../types/OrdersType";
import { UserInfoType } from "../../../../../types/UserInfoType";

type props = {
  User: UserInfoType;
};

const UserDetailsHedder = ({  User }: props) => {
  return (
    <div className="p-5 py-10 items-start bg-white rounded-md flex justify-between border-b-[1px] border-gray-300  ">
      <div>
        <div className="text-lg text-zinc-700 font-semibold">User Details - {User._id}</div>
      </div>
      <div className="flex  justify-center items-center text-indigo-500 font-semibold gap-1">
        <i className="far fa-eye"></i>
        <span>Details</span>
      </div>
    </div>
  );
};

export default UserDetailsHedder;
