import Image from "next/image";
import { OrdersType } from "../../../../../types/OrdersType";
import Table from "../../../../lib/Table";
import DropList from "../../../../lib/DropList";
import AdminActionCard from "./components/AdminActionCard";
import { useState } from "react";
import { useAppSelector } from "../../../../../Redux/hooks";
import SellerAdminActionCard from "./components/SellerAdminActionCard";
import SellerActionCard from "./components/SellerActionCard";
import { OrderStatusType } from "../../../../../types/OrderStatusType";

type props = {
  OrderState: OrdersType;
  OrderStatus: OrderStatusType[];
  setOrderState: (v: OrdersType | ((v: OrdersType) => OrdersType)) => void;
};
const ItemsList = ({ OrderStatus, OrderState, setOrderState }: props) => {
  const userInfo = useAppSelector((state) => state.userInfo.value);

  // const shops: any = {};
  // order.OrderItems.forEach((item) => {
  //   if (!shops[item.Product.ShopId]) {
  //     shops[item.Product.ShopId] = { Shop: item.Product.Shop, OrderItems: [item], Status: "Order Received" };
  //   } else {
  //     shops[item.Product.ShopId].OrderItems.push(item);
  //   }
  // });
  // const Data: {
  //   id: string;
  //   UserId: string;
  //   Status: string;
  //   DeliverySchedule: string;
  //   Amount: number;
  //   Shops: { Shop: ShopsType; OrderItems: OrderItem[]; Status: string }[];
  // } = { id: order._id, UserId: order.UserId, Status: order.Status, DeliverySchedule: order.DeliverySchedule, Amount: order.Amount, Shops: Object.values(shops) };
  return (
    <div className=" h-min w-full rounded-md ">
      <div className="rounded-md overflow-clip border bg-gray-200/60">
        <Table
          Schema={["Shops and  Items"]}
          List={OrderState.OrderShops.map((shop) => {
            return {
              "Shops and  Items": (
                <div className="space-y-5 border-dashed border-2 p-5 rounded-lg border-indigo-400 ">
                  <div className="flex justify-center">
                    <div className="">
                      <div className="border border-gray-200 rounded-md ">
                        <Table
                          Schema={["Shop Logo", "Shop Name", "Order Status", "Amount"]}
                          List={[
                            {
                              "Shop Logo": (
                                <div className="flex  items-center justify-center gap-5 ">
                                  <div className="rounded-full overflow-clip">
                                    <Image src={"http://nginx-proxy/" + shop.Shop.Logo} alt={shop.Shop.Description} width={45} height={45} />
                                  </div>
                                </div>
                              ),
                              "Shop Name": shop.Shop.Name,
                              "Order Status": <div className="p-2 bg-green-600 text-white rounded-full">{shop.ShopOrderStatus.Name}</div>,
                              Amount: shop.OrderItems.reduce((pre, item) => pre + Number.parseFloat((item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2)), 0),
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  {userInfo.AccountType === "Seller" && <SellerActionCard OrderState={OrderState} Shop={shop} OrderStatus={OrderStatus} setOrderState={setOrderState} />}

                  <div className="border border-gray-200 rounded-md">
                    <Table
                      Schema={["Image", "Item", "Product Type", "Varient", "Quantity", "Price"]}
                      List={shop.OrderItems.map((item) => {
                        return {
                          Image: (
                            <div className="flex justify-center">
                              <Image src={"http://nginx-proxy/" + item.Product.FeaturedImage} alt={item.Product.Description} width={45} height={45} />
                            </div>
                          ),
                          Item: <div className="text-sm text-gray-600">{item.Product.Name}</div>,
                          "Product Type": item.Product.ProductType,
                          Varient: item.Product.ProductType === "Variable" ? item.Product.VariableProduct[0].VarientAttributesValues.reduce((pre, curr) => pre + curr.Value.Value + "/", "").slice(0, -1) : "--",
                          Quantity: item.Quantity,
                          Price: (item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2),
                        };
                      })}
                    />
                  </div>
                  {userInfo.AccountType === "Admin" ? <AdminActionCard Shop={shop} setOrderState={setOrderState} /> : <SellerAdminActionCard Shop={shop} />}
                </div>
              ),
              // Price: (item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2),
            };
          })}
        />
      </div>
    </div>
  );
  // return (
  //   <div className=" h-min w-full rounded-md ">
  //     <div className="rounded-md overflow-clip border bg-gray-200/60">
  //       <Table
  //         Schema={["Shop", "Status", "OrderItem", "Total"]}
  //         List={Data.Shops.map((shop) => {
  //           return {
  //             Shop: shop.Shop.Name,
  //             Status: shop.Status,
  //             OrderItem: (
  //               <div className="border border-gray-200 rounded-md">
  //                 <Table
  //                   Schema={["Item", "Product Type", "Varient", "Quantity", "Price"]}
  //                   List={shop.OrderItems.map((item) => {
  //                     return {
  //                       Item: (
  //                         <div className="flex  items-center justify-center gap-5">
  //                           <div>
  //                             <Image src={"http://nginx-proxy/" + item.Product.FeaturedImage} alt={item.Product.Description} width={45} height={45} />
  //                           </div>
  //                           <div>
  //                             <div className="text-sm text-gray-600">{item.Product.Name}</div>
  //                             {/* <div className="text-pink-500 font-semibold">${item.Product..toFixed(2)}</div> */}
  //                           </div>
  //                         </div>
  //                       ),
  //                       "Product Type": item.Product.ProductType,
  //                       Varient: item.Product.ProductType === "Variable" ? item.Product.VariableProduct[0].VarientAttributesValues.reduce((pre, curr) => pre + curr.Value.Value + "/", "").slice(0, -1) : "--",
  //                       Quantity: item.Quantity,
  //                       Price: (item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2),
  //                     };
  //                   })}
  //                 />
  //               </div>
  //             ),
  //             Total: shop.OrderItems.reduce((pre, item) => pre + Number.parseFloat((item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2)), 0),
  //             // Price: (item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2),
  //           };
  //         })}
  //       />
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="px-5 pb-5">
  //     <div className="flex bg-gray-100 p-4 border-[1px] drop-shadow-sm">
  //       <div className="w-[300px] text-center">Item</div>
  //       <div className="w-[200px] text-center">Quantity</div>
  //       <div className="w-[200px] text-center">Price</div>
  //     </div>
  //     <div className="overflow-y-auto customscrollbar  max-h-[300px]">
  //       {order.OrderItems.map((item) => (
  //         <div className="flex  p-4" key={item.Product.ProductType === "Simple" ? item.Product._id : item.Product._id + item.Product.VariableProduct[0]._id}>
  //           <div className="w-[300px] flex gap-2">
  //             <div>
  //               <Image src={"http://nginx-proxy/" + item.Product.FeaturedImage} alt={item.Product.Description} width={45} height={45} />
  //             </div>
  //             <div>
  //               <div className="text-sm text-gray-600">{item.Product.Name}</div>
  //               {/* <div className="text-pink-500 font-semibold">${item.Product..toFixed(2)}</div> */}
  //             </div>
  //           </div>
  //           <div className="w-[200px]  flex items-center justify-center text-zinc-700">{item.Quantity}</div>
  //           <div className="w-[200px]  flex items-center justify-center  text-zinc-700">${(item.Quantity * (item.Product.ProductType === "Simple" ? item.Product.SimpleProduct?.Price || 0 : item.Product.VariableProduct[0].Price)).toFixed(2)}</div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default ItemsList;
