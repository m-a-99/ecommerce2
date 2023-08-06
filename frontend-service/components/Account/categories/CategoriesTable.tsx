import Image from "next/image";
import { CategoriesType } from "../../../types/CategoriesType";
import Table from "../../lib/Table";
import Link from "next/link";
type props = {
  Categories: CategoriesType
};
const CategoriesTable = ({ Categories }: props) => {
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          Schema={["ID", "Name", "Group", "Icon", "Actions"]}
          List={Categories.map((v) => {
            return {
              ID: v._id,
              Name: v.Name,
              Group: (
                <div className="flex items-center space-x-2">
                  <div>
                    <Image width={20} height={10} alt="icon" src={"http://nginx-proxy" + v.Group.Icon} />
                  </div>
                  <div> {v.Group.Name}</div>
                </div>
              ),
              Icon: <Image width={20} height={10} alt="icon" src={"http://nginx-proxy" + v.Icon} />,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`categories/edit/${v._id}`}>
                      <div className="cursor-pointer hover:text-indigo-500  text-zinc-600 select-none  flex justify-center">
                        <i className="far fa-pen-to-square"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

export default CategoriesTable;
