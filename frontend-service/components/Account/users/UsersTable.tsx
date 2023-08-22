import Image from "next/image";
import { useState } from "react";
import Table from "../../lib/Table";
import Link from "next/link";
import { UserInfoType } from "../../../types/UserInfoType";

type props = {
  Users: UserInfoType[];
};
function UsersTable({ Users }: props) {
  const [Schema, setSchema] = useState(["ID", "Image", "FirstName", "LastName", "Email", "AccountType","Status", "Actions"]);
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto  customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          List={Users.map((v) => {
            return {
              ID: v._id,
              Image: <div className="w-12 h-12 bg-gray-300  flex overflow-clip rounded-full">{v.Img && <Image className=" object-cover" width={50} height={50} alt="user Image" src={"http://nginx-proxy" + v.Img} />} </div>,
              FirstName: v.FirstName,
              LastName: v.LastName,
              Email: v.Email,
              AccountType: v.AccountType,
              // Contacts: (
              //   <div className="h-[50px] overflow-x-hidden customscrollbar overflow-y-auto">
              //     {v.Contacts?.map((contact) => (
              //       <div key={contact._id} className="flex gap-[1px] w-[200px] overflow-hidden  ">
              //         <div>{contact.Title}</div>
              //         <div>:</div>
              //         <div className="text-ellipsis overflow-hidden">{contact.Value}</div>
              //       </div>
              //     ))}
              //   </div>
              // ),
              Status: <div className={`${v.Status==="Active"?"bg-green-500":"bg-red-500"} text-white w-16 h-7 flex items-center justify-center rounded-full`}>{v.Status}</div>,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`users/details/${v._id}`}>
                      <div className="cursor-pointer hover:text-indigo-500  text-zinc-600 select-none  flex justify-center">
                        <i className="fa-sharp fa-light fa-circle-book-open text-xl"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              ),
            };
          })}
          Schema={Schema}
        />
      </div>
    </div>
  );
}
export default UsersTable;
