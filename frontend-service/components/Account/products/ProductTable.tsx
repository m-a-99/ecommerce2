import Image from "next/image";
import Table from "../../lib/Table";
import { useAppSelector } from "../../../Redux/hooks";
import Link from "next/link";
import { ProductType } from "../../../types/ProductType";
import product from "../../../pages/product/[id]";
type props = {
  Products:ProductType[];
};
const ProductsTable = ({Products}:props) => {
  console.log(Products)
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-x-auto customscrollbar shadow-sm border bg-gray-200/60">
        <Table
          Schema={["ID", "Name", "Shop", "Group", "Wishes", "Icon", "State", "Actions"]}
          List={Products.map((v) => {
            return {
              ID: v._id,
              Name: v.Name,
              Shop: v.Shop.Name,
              Group: (
                <div className="flex items-center space-x-2">
                  <div>
                    <Image width={20} height={10} alt="icon" src={"http://nginx-proxy/" + v.Group.Icon?.Url} />
                  </div>
                  <div> {v.Group.Name}</div>
                </div>
              ),
              Wishes: v?.Wishers?.length,
              Icon: <Image width={20} height={10} alt="icon" src={"http://nginx-proxy/" + v.FeaturedImage} />,
              State: (
                <div>
                  {v.State === "Pending" && <div className="bg-orange-500 text-white px-2 rounded-full">Pending</div>}
                  {v.State === "Rejected" && <div className="bg-red-500 text-white px-2 rounded-full">Rejected</div>}
                  {v.State === "Approved" && <div className="bg-green-500 text-white px-2 rounded-full">Approved</div>}
                </div>
              ),
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`products/edit/${v._id}`}>
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

export default ProductsTable;
