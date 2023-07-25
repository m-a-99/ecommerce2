import Image from "next/image";
import { OrdersType } from "../../../../../../types/OrdersType";

type props={
  order:OrdersType
}
const ItemsList = ({order}:props) => {
    return (
      <div className="px-5 pb-5">
        <div className="flex bg-gray-100 p-4 border-[1px] drop-shadow-sm">
          <div className="w-[300px] text-center">Item</div>
          <div className="w-[200px] text-center">Quantity</div>
          <div className="w-[200px] text-center">Price</div>
        </div>
        <div className="overflow-y-auto customscrollbar  max-h-[300px]">
          {order.OrderShops.map((shop) =>
            shop.OrderItems.map((item) => (
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
            ))
          )}
        </div>
      </div>
    );
}
 
export default ItemsList;