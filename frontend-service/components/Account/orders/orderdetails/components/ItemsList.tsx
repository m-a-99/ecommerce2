import Image from "next/image";
import { OrderItem, OrdersType } from "../../../../../types/OrdersType";
import Table from "../../../../lib/Table";
import { ShopsType } from "../../../../../types/ShopsType";
import { ProductType } from "../../../../../types/ProductType";

type props = {
  order: OrdersType;
};
const ItemsList = ({ order }: props) => {
  const shops: any = {};
  order.OrderItems.forEach((item) => {
    if (!shops[item.Product.ShopId]) {
      shops[item.Product.ShopId] = { Shop: item.Product.Shop, OrderItems: [item], Status: "Order Received" };
    } else {
      shops[item.Product.ShopId].OrderItems.push(item);
    }
  });
  const Data: {
    id: string;
    UserId: string;
    Status: string;
    DeliverySchedule: string;
    Amount: number;
    Shops: { Shop: ShopsType; OrderItems: OrderItem[]; Status: string }[];
  } = { id: order._id, UserId: order.UserId, Status: order.Status, DeliverySchedule: order.DeliverySchedule, Amount: order.Amount, Shops: Object.values(shops) };
  return (
    <div className=" h-min w-full rounded-md ">
      <div className="rounded-md overflow-clip border bg-gray-200/60">
        <Table
          Schema={["Shop", "Status", "OrderItem", "Total"]}
          List={Data.Shops.map((shop) => {
            return {
              Shop: shop.Shop.Name,
              Status: shop.Status,
              OrderItem: (
                <Table
                  Schema={["Item", "Quantity", "Price"]}
                  List={shop.OrderItems.map((item) => {
                    return {
                      Item: (
                        <div className="flex  items-center justify-center gap-5">
                          <div>
                            <Image src={"http://nginx-proxy/" + item.Product.FeaturedImage} alt={item.Product.Description} width={45} height={45} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">{item.Product.Name}</div>
                            {/* <div className="text-pink-500 font-semibold">${item.Product..toFixed(2)}</div> */}
                          </div>
                        </div>
                      ),
                      Quantity: item.Quantity,
                      Price: (item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2),
                    };
                  })}
                />
              ),
              Total: shop.OrderItems.reduce((pre, item) => pre+Number.parseFloat((item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2)), 0),
              // Price: (item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2),
            };
          })}
        />
      </div>
    </div>
  );
  return (
    <div className="px-5 pb-5">
      <div className="flex bg-gray-100 p-4 border-[1px] drop-shadow-sm">
        <div className="w-[300px] text-center">Item</div>
        <div className="w-[200px] text-center">Quantity</div>
        <div className="w-[200px] text-center">Price</div>
      </div>
      <div className="overflow-y-auto customscrollbar  max-h-[300px]">
        {order.OrderItems.map((item) => (
          <div className="flex  p-4" key={item.Product.ProductType === "Simple" ? item.Product._id : item.Product._id + item.Product.VariableProduct[0]._id}>
            <div className="w-[300px] flex gap-2">
              <div>
                <Image src={"http://nginx-proxy/" + item.Product.FeaturedImage} alt={item.Product.Description} width={45} height={45} />
              </div>
              <div>
                <div className="text-sm text-gray-600">{item.Product.Name}</div>
                {/* <div className="text-pink-500 font-semibold">${item.Product..toFixed(2)}</div> */}
              </div>
            </div>
            <div className="w-[200px]  flex items-center justify-center text-zinc-700">{item.Quantity}</div>
            <div className="w-[200px]  flex items-center justify-center  text-zinc-700">${(item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
