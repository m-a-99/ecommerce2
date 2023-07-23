import React from "react";
import { useAppSelector } from "../../Redux/hooks";

function CheckoutCard({order}:{order:()=>void}) {
  const cart = useAppSelector((state) => state.cart.value);
  
  return (
    <div >
      <div className="p-4  ustomscrollbar max-h-[400px] overflow-y-auto space-y-3 border-b-[1px]">
        {Object.keys(cart).map((key) => (
          <div key={key} className="flex justify-between">
            <div className="flex items-center justify-center space-x-2">
              <div className="font-bold text-zinc-600">{cart[key].Quantity}</div>
              <i className="fa-regular fa-xmark text-gray-600"></i>
              <div className="text-gray-600  ">{cart[key].Product.Name.charAt(0).toUpperCase() + cart[key].Product.Name.substring(1)}</div>
            </div>
            <div className="text-gray-600 font-mono">{`$${cart[key].Quantity * (cart[key].Product.ProductType === "Simple" ? cart[key].Product.SimpleProduct.Price : cart[key].Product.VariableProduct[0].Price)}`}</div>
          </div>
        ))}
      </div>

      <div className="p-3 space-y-2 border-b-[1px]">
        <div className="text-gray-600  flex justify-between">
          <div>Sub Total</div>
          <div className="text-sm">
            $
            {Object.values(cart).reduce((previousValue, currentValue) => {
              return previousValue + currentValue.Quantity * (currentValue.Product.ProductType === "Simple" ? currentValue.Product.SimpleProduct.Price : currentValue.Product.VariableProduct[0].Price);
            }, 0)}
          </div>
        </div>
        <div className="text-gray-600  flex justify-between">
          <div>Tax</div>
          <div className="text-sm">$0.00</div>
        </div>
        <div className="text-gray-600  flex justify-between">
          <div>Shipping</div>
          <div className="text-sm">$0.00</div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center ">
          <div className="font-bold  text-zinc-600 text-lg"> Total</div>
          <div className="text-gray-700 font-semibold">
            $
            {Object.values(cart).reduce((previousValue, currentValue) => {
              return previousValue + currentValue.Quantity * (currentValue.Product.ProductType === "Simple" ? currentValue.Product.SimpleProduct.Price : currentValue.Product.VariableProduct[0].Price);
            }, 0)}
          </div>
        </div>
      </div>
      <div className=" p-5 bg-white drop-shadow-lg space-y-5">
        <div className="font-semibold text-slate-600">Choose Payment Method</div>
        <div className="flex flex-wrap justify-center gap-4">
          <div className=" w-[100px] h-[60px] border-[1px] flex justify-center items-center  rounded-md">Stripe</div>
          <div className="w-[100px] h-[60px] border-[1px] flex justify-center items-center text-center rounded-md">Cash On Delivery</div>
        </div>
        <div onClick={order} className="flex cursor-pointer select-none  justify-center md:justify-center lg:justify-end">
          <div className="px-5 py-3 select-none bg-indigo-500 text-white w-min rounded-md">Confirm</div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCard;
