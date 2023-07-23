import "../styles/globals.css";
import "../styles/icons/css/all.css";
import type { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import { store } from "../Redux/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { setCart, setCartFromLocalStorage, setCartFromLocalStorageAndCreateSession } from "../Redux/cart";
import { setUserInfo } from "../Redux/userInfo";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { setProducts } from "../Redux/products";
import { setOrders } from "../Redux/orders";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (pageProps.InitialState) {
    store.dispatch(setCart(pageProps.InitialState.cart));
    store.dispatch(setUserInfo(pageProps.InitialState.userInfo));
    store.dispatch(setProducts(pageProps.InitialState.products));
    store.dispatch(setOrders(pageProps.InitialState.orders));
  }

  useEffect(() => {
    if (pageProps.InitialState?.cart?.Session?.login===false) {
      store.dispatch(setCartFromLocalStorage());
    } else if (pageProps.InitialState?.cart?.Session?.login) {
      store.dispatch(setCartFromLocalStorageAndCreateSession());
    }
  }, [router.asPath]);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}

export default MyApp;
