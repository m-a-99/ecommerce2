import Image from "next/image";
import { useState } from "react";
import { GroupsType } from "../../../types/GroupsType";
import Table from "../../lib/Table";

type props = {
  Groups: GroupsType;
};

const GroupTable = ({ Groups }:props) => {
  const Schema=["ID", "Name", "Icon", "Actions"]

  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          List={
            Groups.map((v) => {
              return {
                ID: v._id,
                Name: v.Name,
                Icon: <Image width={20} height={20} alt="icon" src={"http://nginx-proxy" + v.Icon} />,
              };
            }) as any
          }
          Schema={Schema}
        />
      </div>
    </div>
  );
};

export default GroupTable;
