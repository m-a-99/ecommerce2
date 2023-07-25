import { useAppSelector } from "../../../../../Redux/hooks";
import { OrdersType } from "../../../../../types/OrdersType";

type props={
  order:OrdersType
}

const OrderAddressAndDetails = ({order}:props) => {
  return (
    <div className="p-5  bg-white grid grid-cols-12 border-b-[1px] gap-5 border-gray-300 ">
      <div className="col-span-5 border-r-[1px] space-y-2  border-gray-300">
        <div>
          <div className="font-semibold text-zinc-700 ">Shipping Address</div>
          <div className="text-sm text-gray-500">
            <div>{order.ShippingAddress?.Title}</div>
            <div>{order.ShippingAddress?.StreetAddress}</div>
            <div>{`${order.ShippingAddress?.City} , ${order.ShippingAddress?.State} , ${order.ShippingAddress?.Zip} , ${order.ShippingAddress?.Country}`}</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-zinc-700 "> Billing Address </div>
          <div className="text-sm text-gray-500">
            <div>{order.BillingAddress?.Title}</div>
            <div>{order.BillingAddress?.StreetAddress}</div>
            <div>{`${order.BillingAddress?.City} , ${order.BillingAddress?.State} , ${order.BillingAddress?.Zip} , ${order.ShippingAddress?.Country}`}</div>
          </div>
        </div>
      </div>
      <div className="col-span-3 border-r-[1px] space-y-2  border-gray-300">
        <div>
          <div className="font-semibold text-zinc-700 ">Contacts</div>
          <div className="pr-2">
            <div className="space-y-3 overflow-y-auto customscrollbar max-h-[250px]">
              {order.Contacts.map((contact) => (
                <div className="text-sm text-gray-500">
                  <div className="text-gray-500 font-semibold truncate ">{contact?.Title}</div>
                  <div className="truncate">{contact.Value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-4">
        <div className="flex justify-between text-gray-500">
          <div>Sub Total</div>
          <div>${order.Total.toFixed(2)}</div>
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
          <div>${order.Total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderAddressAndDetails;
