import Image from "next/image";
import { useState } from "react";
import { AttributesType } from "../../../types/AttributesType";
import Table from "../../lib/Table";
import Link from "next/link";

type props = {
  Attributes: AttributesType
};
function AttributesTable({ Attributes }: props) {
  const [Schema, setSchema] = useState(["ID", "Name", "Shop", "Value", "Actions"]);
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          List={Attributes.map((v) => {
            return {
              ID: v._id,
              Name: v.Name,
              Shop: v.Shop?.Name || "",
              Value: v.AttributeValues.reduce((prev, curr) => prev + " , " + curr.Value, "").substring(3),
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`attributes/edit/${v._id}`}>
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

export default AttributesTable;
