import Image from "next/image";
import { useState } from "react";
import { AuthersType } from "../../../types/AuthersType";
import Table from "../../lib/Table";
import Link from "next/link";

type props = {
  Authors:AuthersType
};

function AuthorsTable({ Authors }: props) {
  const [Schema, setSchema] = useState(["ID", "Image", "Name", "Actions"]);
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-clip shadow-sm border bg-gray-200/60">
        <Table
          List={Authors.map((v) => {
            return {
              ID: v._id,
              Image: v.Image&&<Image width={30} height={30} alt="icon" src={"http://nginx-proxy" + v.Image} />,
              Name: v.Name,
              Actions:(
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`authors/edit/${v._id}`}>
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

export default AuthorsTable;
