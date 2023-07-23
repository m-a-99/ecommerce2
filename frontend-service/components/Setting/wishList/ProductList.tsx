import React, { useEffect, useState } from "react";
import Productcard from "./components/Productcard";
import useDeleteFetch from "../../../custom_hooks/useDeleteFetch";
import Spinner from "../../lib/Spinner";
type props = {
  WishList: any[];
};

function ProductList({ WishList }: props) {
  const {data, IsPending, Delete } = useDeleteFetch();
  const [list,setlist]=useState(WishList)
  
  useEffect(() => {
    if (data) {
      console.log(data);
      setlist((v) => v.filter((wish) => wish.Product._id !== data.ProductId));
    }
  }, [data]);
  return (
    <div className="bg-white w-full relative">
      {IsPending && <Spinner />}
      <div className="p-5 text-gray-700 font-semibold">WishList Products</div>
      <div className="space-y-4 p-4">
        {list.map((el) => (
          <div key={el._id}>
            <Productcard Product={el.Product} Delete={Delete} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
