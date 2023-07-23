import Image from "next/image";
import { ProductType } from "../../../../../types/ProductType";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FlyImg from "./components/FlyImg";
import { useDispatch } from "react-redux";
import { appendCart, deleteFromCart } from "../../../../../Redux/cart";
import { useAppSelector } from "../../../../../Redux/hooks";
import { unWish, wish } from "../../../../../Redux/products";

type props = {
  product: ProductType;
};
function Product2({ product }: props) {
  const [flysrc, setflysrc] = useState<string>();
  const [visable, setvisable] = useState(false);
  const { push } = useRouter();
  const dispatch = useDispatch();
  const AddedCount = useAppSelector((state) => state.cart.value[product._id]?.Quantity || 0);
  const [price, setprice] = useState("")


  useEffect(() => {
    if(product.ProductType==="Simple"){
      setprice("" + (product?.SimpleProduct?.Price || 0));
    }
    else{
      const prices=product.VariableProduct.map(v=>v.Price);
      setprice(`${Math.min(...prices)} - ${Math.max(...prices)}`);
    }
    const img: HTMLImageElement | undefined = document.querySelector("#id" + product._id) as HTMLImageElement;
    if (img) {
      setflysrc(img.src);
    }
  }, []);

  // useEffect(()=>{
  //   if(wished){
  //     post("/shopping-service/wish",JSON.stringify({ProductId:product._id}))
  //   }
  //   else{
  //     Delete("/shopping-service/wish", JSON.stringify({ ProductId: product._id }));
  //   }
  // },[wished])
  function Animationend() {
    setvisable(false);
  }
  function Add() {
    if (product.ProductType === "Simple") {
      setvisable(true);
      dispatch(appendCart(product));
    } else {
      push("/product/" + product._id);
    }
  }
  function remove() {
    dispatch(deleteFromCart(product));
  }

  function addmore() {
    dispatch(appendCart(product));
  }
  function wishProduct(){
    dispatch(wish(product._id))
  }
  function unWishProduct() {
    dispatch(unWish(product._id));
  }
  

  
  return (
    // <div className="w-[300px] h-max first-letter:flex flex-col justify-between rounded-md drop-shadow-xl bg-white">
    //   <div>
    //     <Image width={150} height={150} alt={product.Description} src={"http://nginx-proxy" + product.FeaturedImage} className="w-full rounded-md "></Image>
    //     <h1 className="px-4 py-2 text-zinc-700 font-semibold">{product.Name + "ergergerg"}</h1>
    //     <p className="px-4 py-2 text-sm text-zinc-400">{product.Description + "fldbn sdflb nlsdfkbn dfbl dfs;b pdfok dfgj"}</p>
    //   </div>
    //   <div className="flex justify-between p-4 ">
    //     {product.ProductType === "Simple" && <h1 className="text-2xl">{product.SimpleProduct.Price}</h1>}
    //     {product.ProductType === "Variable" && <h1 className="text-2xl">{product.VariableProduct[0].Price}</h1>}
    //     <div></div>
    //   </div>
    // </div>
    <>
      {visable && flysrc && <FlyImg imgsrc={flysrc} Animationend={Animationend} />}
      <div className="drop-shadow-md">
        <div className="lg:w-[250px] md:w-[250px] sm:w-[300px] w-[300px] rounded-md h-[310px]   bg-white">
          <div className=" w-full h-[220px] flex justify-center overflow-clip  rounded-md relative ">
            <div className="absolute z-10  p-1 top-0 w-full flex justify-between items-center">
              <div className="text-[14px] h-6 font-medium bg-gradient-to-r from-indigo-500 to-indigo-300 drop-shadow-lg  text-white flex justify-center items-center w-20 rounded-full bg-opacity-80">Sale 20%</div>
              {!product.Wished && (
                <div onClick={() => wishProduct()} className=" cursor-pointer  shadow-lg w-10 mr-1 h-10 flex justify-center items-center  rounded-full bg-white drop-shadow-lg">
                  <i className="fat text-xl mt-1 transition ease-out duration-75  fa-heart text-gray-600"></i>
                </div>
              )}
              {product.Wished && (
                <div onClick={() => unWishProduct()} className=" bg-red-100 shadow-red-300  cursor-pointer shadow-lg w-10 mr-1 h-10 flex justify-center items-center  rounded-full drop-shadow-lg">
                  <i className="fas text-xl mt-1 transition ease-in duration-75 fa-heart text-rose-500"></i>
                </div>
              )}
            </div>
            <Image onClick={() => push("/product/" + product._id)} id={"id" + product._id} src={"http://nginx-proxy" + product.FeaturedImage} alt={product.Description} width={200} height={200} className="object-contain hover:scale-[1.05] cursor-pointer"></Image>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-[70%] h-[1px] bg-gray-300"></div>
          </div>
          <div className="px-4 mt-5  flex justify-between items-center ">
            <div className="flex flex-col justify-center">
              <div className="text-gray-700 font-semibold">{product.Name}</div>
              <div className="text-gray-500 text-sm whitespace-nowrap text-ellipsis overflow-hidden max-w-[140px]">{product.Description}</div>
            </div>
            <div className="space-y-[4px]">
              <div className="text-center text-gray-600 font-semibold">{price} $</div>

              {AddedCount === 0 && (
                <div onClick={Add} className="bg-indigo-500  hover:bg-indigo-600 w-[60px] h-[30px] flex justify-center items-center select-none  font-bold rounded-lg text-white cursor-pointer">
                  Add +
                </div>
              )}
              {AddedCount > 0 && (
                <div className="bg-indigo-500 select-none  w-[60px] h-[30px] hover:bg-indigo-600 font-bold rounded-lg text-white cursor-pointer">
                  <div className="flex h-full ">
                    <div onClick={remove} className="w-[20px] rounded-tl-lg rounded-bl-lg  h-full flex items-center justify-center hover:bg-indigo-500">
                      -
                    </div>
                    <div className="w-[20px] flex items-center  justify-center">{AddedCount}</div>
                    <div onClick={addmore} className=" w-[20px] rounded-tr-lg rounded-br-lg  h-full flex items-center justify-center hover:bg-indigo-500">
                      +
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product2;
