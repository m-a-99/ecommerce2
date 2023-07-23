import { useState } from "react";
import { useDispatch } from "react-redux";
import { appendCart, deleteFromCart, deleteProduct } from "../../../../../Redux/cart";
import { ProductType } from "../../../../../types/ProductType";

type props = {
  item: {
    Quantity: number;
    Product: ProductType;
  };
};

const CartIteam = ({ item }: props) => {
  const dispatch = useDispatch();
  const [confDelete, setconfDelete] = useState(false);
  function addMore() {
    dispatch(appendCart(item.Product));
  }
  function removeItem() {
    if (item.Quantity > 1) {
      dispatch(deleteFromCart(item.Product));
    } else {
      setconfDelete(true);
    }
  }
  function cancel() {
    setconfDelete(false);
  }
  function remove() {
    dispatch(deleteProduct(item.Product));
  }

  function deleteItem() {
    setconfDelete(true);
  }

  return (
    <div className="flex justify-between bg-white drop-shadow-lg p-4 m-2 rounded-lg relative">
      <div className="flex h-20 justify-center items-center space-x-2">
        <div className="w-8  select-none  rounded-full h-full bg-gray-100 flex flex-col justify-between items-center">
          <div onClick={addMore} className="cursor-pointer rounded-t-full hover:bg-gray-300 border-b-[1px] w-full border-gray-300 flex justify-center   items-center">
            +
          </div>
          <div className=" flex justify-center items-center">{item.Quantity}</div>
          <div onClick={removeItem} className="cursor-pointer rounded-b-full hover:bg-gray-300 border-t-[1px] w-full border-gray-300 flex justify-center   items-center">
            -
          </div>
        </div>
        <img src={item.Product.ProductType === "Simple" ? item.Product.FeaturedImage : item?.Product?.VariableProduct[0]?.Image || item.Product.FeaturedImage} className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="font-semibold">{(item.Product.Name || "").charAt(0).toUpperCase() + (item.Product.Name || "").substring(1)}</h1>
          {item.Product.ProductType==="Variable"&&<p className="text-gray-600">{item.Product.VariableProduct[0].VarientAttributesValues.reduce((pre, cur) => (pre + (pre ? "/" : "") + cur.Value.Value.charAt(0).toUpperCase() + cur.Value.Value.substring(1)), "")}</p>} <p className="text-gray-600">${item.Product.ProductType === "Simple" ? item.Product.SimpleProduct.Price : item.Product.VariableProduct[0].Price}</p>
        </div>
      </div>
      <div className="flex items-center   drop-shadow-2xl rounded-xl space-x-5">
        <div className="font-bold">${item.Quantity * ((item.Product.ProductType === "Simple" ? item.Product.SimpleProduct.Price : item.Product.VariableProduct[0].Price) || 0)}</div>
        <div onClick={deleteItem} className="w-6 h-6 flex justify-center items-center rounded-full text-white bg-red-400 cursor-pointer hover:bg-red-500">
          <i className="far fa-xmark"></i>
        </div>
      </div>

      {confDelete && (
        <div className="space-x-2 transition absolute w-full h-full flex justify-center items-center backdrop-blur-[1px] bg-opacity-60 bg-zinc-900  top-0 left-0 z-200 rounded-lg">
          <div onClick={remove} className="bg-red-500 p-1 cursor-pointer hover:bg-red-600 drop-shadow-lg flex justify-center items-center px-2 w-fit text-white font-semibold rounded-full">
            remove
          </div>
          <div onClick={cancel} className="bg-white p-1  cursor-pointer hover:bg-gray-300 flex justify-center items-center px-2 w-fit  drop-shadow-lg  font-[30px] rounded-full">
            cancel
          </div>
        </div>
      )}
    </div>
  );
};

export default CartIteam;
