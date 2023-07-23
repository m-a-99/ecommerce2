import Image from "next/image";
import { useState } from "react";
import { SocialMediaPlatformsType } from "../../../types/SotialProfilesType";
import Table from "../../lib/Table";
import Link from "next/link";

type props = {
  SocialMediaPlatforms: SocialMediaPlatformsType
};
function SocialMediaPlatformsTable({ SocialMediaPlatforms }: props) {
  const [Schema, setSchema] = useState(["ID", "Name", "Icon", "Actions"]);
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-clip shadow-sm border bg-gray-200/60">
        <Table
          List={SocialMediaPlatforms.map((v) => {
            return {
              ID: v._id,
              Name: v.Name,
              Icon: <Image width={20} height={20} alt="icon" src={"http://nginx-proxy" + v.Icon} />,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`socialmediaplatforms/edit/${v._id}`}>
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

export default SocialMediaPlatformsTable;
