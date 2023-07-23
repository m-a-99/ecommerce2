import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ProductType } from "../types/ProductType";
import Cookies from "universal-cookie";
const cookies = new Cookies();
interface cartValueType {
  [key: string]: {
    Quantity: number;
    Product: ProductType;
  };
}
interface sessionType {
  login?: boolean;
  session?: { [key: string]: any } & { _id: string };
}
interface cartreftype {
  loading: boolean;
  value: cartValueType;
  Session: sessionType;
  error: string;
}
async function setSession(CartValue: cartValueType, session: sessionType) {
  if (!session.login) {
    localStorage.setItem("cartValue", JSON.stringify(CartValue));
  } else {
    let token = cookies.get("jwt");
    const res = await fetch("/shopping-service/session/setcart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        Cart: Object.values(CartValue).map((v) => {
          return { ProductId: v.Product._id, ProductType: v.Product.ProductType, VariableId: v.Product.ProductType === "Variable" ? v.Product.VariableProduct[0]._id : undefined, Quantity: v.Quantity };
        }),
      }),
    });
    if (res.status !== 200) {
      toast(await res.text(), { type: "error" });
    }
  }
}

const initialState: cartreftype = {
  error: "",
  loading: true,
  value: {},
  Session: {},
};
export const FetchCart = createAsyncThunk("cart/FetchCart", (token: string) => {
  //const { SessionId, Token } = data;
  return new Promise(async (res, rej) => {
    try {
      // const resdata = await fetch("http://nginx-proxy/shopping-service/session", { method: "POST", headers: { "Content-Type": "application/json", Authorization: Token }, body: JSON.stringify({ SessionId: SessionId || "" }) });
      const resdata = await fetch("http://nginx-proxy/shopping-service/session", { method: "POST", headers: { Authorization: token } });
      if (!resdata.ok) {
        rej(await resdata.text());
      } else {
        const session = await resdata.json();
        res(session);
      }
    } catch (e: any) {
      rej(e);
    }
  });
});
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      if (action.payload.Session?.login === true) {
        // if (cookies.get("SessionId") !== action.payload.Session.session._id) {
        //   cookies.set("SessionId", action.payload.Session.session._id, {
        //     path: "/",
        //     maxAge: 60 * 60 * 10,
        //     //secure: true:https,
        //     // sameSite: "none",
        //   });
        // }
        state.Session = action.payload.Session;
        state.value = action.payload.value;
        state.error = action.payload.error;
        state.loading = action.payload.loading;
      }

      //localStorage.setItem("cart", JSON.stringify(action.payload));
    },
    setCartFromLocalStorage(state) {
      const value: cartValueType = JSON.parse(localStorage.getItem("cartValue") || "{}");
      if (value) {
        state.value = value;
      }
    },
    setCartFromLocalStorageAndCreateSession(state) {
      const localval = localStorage.getItem("cartValue");
      if (localval) {
        const value: cartValueType = JSON.parse(localval);
        const tmp = { ...state.value };
        for (const val in value) {
          if (tmp[val]) {
            state.value[val].Quantity += value[val].Quantity;
          } else {
            state.value[val] = value[val];
          }
        }
        setSession({ ...state.value }, { ...state.Session });
        localStorage.removeItem("cartValue");
      }
      // const value: cartValueType = JSON.parse();
      // if (value) {
      //   console.log(value)
      //   //state.value = value;
      //   setSession(value, {...state.Session});
      // }
    },
    appendCart: (state, action) => {
      if (state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")]) {
        state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")].Quantity++;
      } else {
        state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")] = { Quantity: 1, Product: action.payload };
      }
      setSession({ ...state.value }, { ...state.Session });
      //localStorage.setItem("cart", JSON.stringify(state.value));
    },
    deleteFromCart: (state, action) => {
      if (state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")].Quantity > 1) {
        state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")].Quantity--;
      } else {
        delete state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")];
      }
      setSession({ ...state.value }, { ...state.Session });

      //localStorage.setItem("cart", JSON.stringify(state.value));
    },
    addProductWithQuantity(state, action) {
      if (state.value[action.payload.Product._id + (action.payload.Product.ProductType === "Variable" ? action.payload.Product.VariableProduct[0]._id : "")]) {
        state.value[action.payload.Product._id + (action.payload.Product.ProductType === "Variable" ? action.payload.Product.VariableProduct[0]._id : "")].Quantity += action.payload.Quantity;
      } else {
        state.value[action.payload.Product._id + (action.payload.Product.ProductType === "Variable" ? action.payload.Product.VariableProduct[0]._id : "")] = { Quantity: action.payload.Quantity, Product: action.payload.Product };
      }
      toast("product added to cart", { type: "success", theme: "light" });
      setSession({ ...state.value }, { ...state.Session });
    },
    deleteProduct(state, action) {
      delete state.value[action.payload._id + (action.payload.ProductType === "Variable" ? action.payload.VariableProduct[0]._id : "")];
      setSession({ ...state.value }, { ...state.Session });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(FetchCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(FetchCart.rejected, (state, action) => {
      state.error = action.error as string;
      state.loading = false;
      state.value = {};
    });
    builder.addCase(FetchCart.fulfilled, (state, action: any) => {
      state.value = {};
      if (action.payload.login) {
        // SessionCartFormatter(action.payload).forEach((value: any) => {
        action.payload.session.Cart.forEach((value: any) => {
          state.value[value.Product._id + (value.Product.ProductType === "Variable" ? value.Product.VariableProduct[0]._id : "")] = value;
        });
      }
      state.error = "";
      state.loading = false;
      state.Session = action.payload;
    });
  },
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {

  //     if (Object.keys(action.payload.cart.value).length===0) {
  //       console.log(action.payload.cart.value);
  //       return state;
  //     }

  //     state.value = action.payload.cart.value;
  //   },
  // },
});
export const { setCart, setCartFromLocalStorage, setCartFromLocalStorageAndCreateSession, appendCart, deleteFromCart, addProductWithQuantity, deleteProduct } = cartSlice.actions;
export default cartSlice.reducer;
