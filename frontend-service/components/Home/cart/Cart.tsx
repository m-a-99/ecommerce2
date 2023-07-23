import{ useState } from "react";
import { useAppSelector } from "../../../Redux/hooks";
import CartList from "./cartList/CartList";

function Cart() {
  const [cartlist, setcartlist] = useState(false);
  const [cartListAnimation, setcartListAnimation] = useState("animate-growleft");
  const cart = useAppSelector((state) => state.cart.value);

  function Animationend() {
    if (cartListAnimation === "animate-growright") {
      setcartlist(false);
      setcartListAnimation("animate-growleft");
    }
  }
  return (
    <div>
      {cartlist && <CartList Animationend={Animationend} setcartListAnimation={setcartListAnimation} cartListAnimation={cartListAnimation} />}
      <div onClick={() => setcartlist(true)} className=" border-2  shadow-sm p-[4px] rounded-xl relative cartelement cursor-pointer">
        <div className="w-5 h-5 bg-gradient-to-r from-purple-700 to-indigo-400 text-white flex justify-center items-center rounded-full absolute top-[-10px] right-[-12px]">{Object.keys(cart).length}</div>
        <i className="fas fa-cart-shopping-fast text-xl  bg-clip-text bg-indigo-500 text-transparent" />
      </div>
    </div>
  );
}

export default Cart;
