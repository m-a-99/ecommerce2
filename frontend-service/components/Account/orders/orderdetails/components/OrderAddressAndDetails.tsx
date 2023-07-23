import { useAppSelector } from "../../../../../Redux/hooks";
import { OrdersType } from "../../../../../types/OrdersType";

type props={
  order:OrdersType
}

const OrderAddressAndDetails = ({order}:props) => {
  const userInfo=useAppSelector(state=>state.userInfo.value);
  return (
    <div className="p-5  bg-white grid grid-cols-12 border-b-[1px] gap-5 border-gray-300 ">
      <div className="col-span-7 border-r-[1px] space-y-2  border-gray-300">
        <div>
          <div className="font-semibold text-zinc-700 ">Shipping Address</div>
          <div className="text-sm text-gray-500">
            <div>{userInfo.ShippingAddress?.Title}</div>
            <div>{userInfo.ShippingAddress?.StreetAddress}</div>
            <div>{`${userInfo.ShippingAddress?.City},${userInfo.ShippingAddress?.State},${userInfo.ShippingAddress?.Zip},${userInfo.ShippingAddress?.Country}`}</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-zinc-700 "> Billing Address </div>
          <div className="text-sm text-gray-500">
            <div>{userInfo.BillingAddress?.Title}</div>
            <div>{userInfo.BillingAddress?.StreetAddress}</div>
            <div>{`${userInfo.BillingAddress?.City},${userInfo.BillingAddress?.State},${userInfo.BillingAddress?.Zip},${userInfo.ShippingAddress?.Country}`}</div>
          </div>
        </div>
      </div>
      <div className="col-span-5">
        <div className="flex justify-between text-gray-500">
          <div>Sub Total</div>
          <div>${order.Amount.toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-gray-500">
          <div>Discount</div>
          <div>${0.0}</div>
        </div>
        <div className="flex justify-between text-gray-500">
          <div>Delivery Fee</div>
          <div>${0.0}</div>
        </div>
        <div className="flex justify-between text-gray-500">
          <div>Tax</div>
          <div>${0.0}</div>
        </div>
        <div className="flex justify-between font-semibold text-zinc-700">
          <div>Total</div>
          <div>${order.Amount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderAddressAndDetails;
