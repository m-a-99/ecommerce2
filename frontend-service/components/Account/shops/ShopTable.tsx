import Image from "next/image";
import { ShopsType } from "../../../types/ShopsType";
import Link from "next/link";
import Table from "../../lib/Table";

type props = {
  shops: ShopsType[];
};
const ShopTable = ({ shops }: props) => {
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-clip shadow-sm border bg-gray-200/60">
        <Table
          Schema={["Logo", "Name", "Owner Name", "Products", "Orders", "Status", "Actions"]}
          List={shops.map((shop) => {
            return {
              Logo: <Image src={"http://nginx-proxy/" + shop.Logo} width={40} height={40} alt={shop.Description} />,
              Name: shop.Name,
              "Owner Name": `${shop.Owner.FirstName} ${shop.Owner.LastName}`,
              Products: shop.ProductsCount,
              Orders: 0,
              Status: <div className="flex justify-center">{shop.Active ? <div className="px-3 rounded-full bg-green-500 text-white text-center">A ctive</div> : <div className="px-3 rounded-full bg-red-500 text-white text-center">Inactive</div>}</div>,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`shops/edit/${shop._id}`}>
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

export default ShopTable;
