import Image from "next/image";
import { ShopsType } from "../../../types/ShopsType";
import Link from "next/link";
import Table from "../../lib/Table";
import { ShippingType } from "../../../types/ShippingType";

type props = {
  Shippings: ShippingType[];
};
const ShippingsTable = ({ Shippings }: props) => {
  return (
    <div className=" h-min w-full shadow-md rounded-md ">
      <div className="rounded-md overflow-clip shadow-sm border bg-gray-200/60">
        <Table
          Schema={["ID", "Name", "Amount", "Global", "Type", "Actions"]}
          List={Shippings.map((shipping) => {
            return {
              ID: shipping._id,
              Name: shipping.Name,
              Amount: shipping.Amount,
              Global: "" + shipping.Global,
              Type: shipping.ShippingType,
              Actions: (
                <div className="flex justify-center">
                  <div className="w-full">
                    <Link href={`shippings/edit/${shipping._id}`}>
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

export default ShippingsTable;
