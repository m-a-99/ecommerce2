import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductType } from "../types/ProductType";
import Cookies from "universal-cookie";
import { RootState } from "./store";
const cookies = new Cookies();
interface valueType {
  [key: string]: ProductType;
}
interface initialStateType {
  error: string;
  loading: boolean;
  value: valueType;
  page: number;
  hasNext: boolean;
}
const initialState: initialStateType = {
  error: "",
  loading: true,
  value: {},
  page: 1,
  hasNext: false,
};

function wishProduct(id: string) {
  let token = cookies.get("jwt");
  fetch("/shopping-service/wish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ ProductId: id }),
  });
}
function unWishProduct(id: string) {
  let token = cookies.get("jwt");
  fetch("/shopping-service/wish", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ ProductId: id }),
  });
}
export const FetchProducts = createAsyncThunk("products-service/products", (token: string) => {
  return new Promise(async (res, rej) => {
    try {
      const Page = productSlice.getInitialState().page;
      const resData = await fetch(`http://nginx-proxy/products-service/products?page=${Page}`, { headers: { Authorization: token } });
      if (resData.ok) {
        res(await resData.json());
      } else {
        rej(await resData.text());
      }
    } catch (e: any) {
      rej(e);
    }
  });
});

export const FetchMoreProducts = createAsyncThunk("products-service/FetchMoreProducts", (token: string,{getState}) => {
  return new Promise(async (res, rej) => {
    try {
      const Page = (getState() as RootState).products.page;
      const resData = await fetch(`/products-service/products?page=${Page + 1}`, { headers: { Authorization: token } });
      if (resData.ok) {
        res(await resData.json());
      } else {
        rej(await resData.text());
      }
    } catch (e: any) {
      rej(e);
    }
  });
});

const productSlice = createSlice({
  initialState,
  name: "products",
  reducers: {
    setProducts: (state, action) => {
      state.loading = action.payload.loading;
      state.value = action.payload.value;
      state.error = action.payload.error;
      state.page=action.payload.page
      state.hasNext=action.payload.hasNext
    },
    wish: (state, action) => {
      state.value[action.payload] && (state.value[action.payload].Wished = true);
      wishProduct(action.payload);
    },
    unWish: (state, action) => {
      state.value[action.payload] && (state.value[action.payload].Wished = false);
      unWishProduct(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(FetchProducts.pending, (state, action) => {
      state.error = "";
      state.loading = true;
      state.value = {};
    });
    builder.addCase(FetchProducts.rejected, (state, action) => {
      state.error = action.error as string;
      state.loading = false;
      state.value = {};
    });
    builder.addCase(FetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const products: { Products: ProductType[]; HasNext: boolean; Page: number } = action.payload as any;
      const tmp: valueType = {};
      products.Products.forEach((product) => {
        tmp[product._id] = product;
      });
      state.hasNext = products.HasNext;
      state.page = products.Page;
      state.value = tmp;
    });
    builder.addCase(FetchMoreProducts.pending, (state, action) => {
      state.error = "";
      state.loading = true;
    });
    builder.addCase(FetchMoreProducts.rejected, (state, action) => {
      state.error = action.error as string;
      state.loading = false;
    });
    builder.addCase(FetchMoreProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const products: { Products: ProductType[]; HasNext: boolean; Page: number } = action.payload as any;
      const tmp: valueType = {};
      products.Products.forEach((product) => {
        tmp[product._id] = product;
      });
      state.hasNext = products.HasNext;
      state.page = products.Page;
      state.value =Object.assign(state.value,tmp)
    });
  },
});

export const { setProducts, wish, unWish } = productSlice.actions;

export default productSlice.reducer;
