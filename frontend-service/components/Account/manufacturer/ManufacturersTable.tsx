import Image from "next/image";
import { useState } from "react";
import { ManufacturersType } from "../../../types/ManufacturersType";
import Table from "../../lib/Table";
import Link from "next/link";

type props = {
  Manufacturers: ManufacturersType
};
function ManufacturersTable({ Manufacturers }: props) {
  const [Schema, setSchema] = useState(["ID", "Logo", "Name", "Actions"]);
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          List={Manufacturers.map((v) => {
            return {
              ID: v._id,
              Logo: <Image width={30} height={30} alt="icon" src={"http://nginx-proxy" + v.Logo} />,
              Name: v.Name,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`manufacturers/edit/${v._id}`}>
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

export default ManufacturersTable;
