import Image from "next/image";
import { useState } from "react";
import { IconsType } from "../../../types/IconsType";
import Table from "../../lib/Table";
import Link from "next/link";

type props = {
  Icons: IconsType
};
function IconsTable({ Icons }: props) {
  const [Schema, setSchema] = useState(["ID", "Name", "Icon", "Actions"]);
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          List={Icons.map((v) => {
            return {
              ID: v._id,
              Name: v.Name,
              Icon: <Image width={20} height={20} alt="icon" src={"http://nginx-proxy" + v.Url} />,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`icons/edit/${v._id}`}>
                      <div className="cursor-pointer hover:text-indigo-500  text-zinc-600 select-none  flex justify-center">
                        <i className="far fa-pen-to-square"></i>
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

export default IconsTable;
