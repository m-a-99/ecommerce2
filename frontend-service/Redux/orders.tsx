import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrdersType } from "../types/OrdersType";
import { RootState } from "./store";
type valueType = { [key: string]: OrdersType };

type InitialStateType = {
  loading: boolean;
  error: string;
  value: valueType;
  page: number;
  hasNext: boolean;
  count: number;
  pages: number;
};
const Initialstate: InitialStateType = {
  loading: false,
  error: "",
  value: {},
  page: 1,
  hasNext: false,
  count: 0,
  pages: 0,
};

export const FetchOrders = createAsyncThunk("shopping-service/orders", (token: string) => {
  return new Promise(async (res, rej) => {
    try {
      const Page = orderSlice.getInitialState().page;
      const resData = await fetch(`http://nginx-proxy/shopping-service/orders?page=${Page}`, { headers: { Authorization: token } });
      if (resData.ok) {
        res(await resData.json());
      } else {
        rej(resData.text());
      }
    } catch (e: any) {
      rej(e);
    }
  });
});

export const FetchMoreOrders = createAsyncThunk("products-service/FetchMoreOrders", (token: string, { getState }) => {
  return new Promise(async (res, rej) => {
    try {
      const Page = (getState() as RootState).orders.page;
      const resData = await fetch(`/shopping-service/orders?page=${Page + 1}`, { headers: { Authorization: token } });
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

export const FetchOrdersPage = createAsyncThunk("products-service/FetchOrdersPage", ({ page, token }: { token: string; page: number }) => {
  return new Promise(async (res, rej) => {
    try {
      const resData = await fetch(`http://nginx-proxy/shopping-service/orders?page=${page}`, { headers: { Authorization: token } });
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

const orderSlice = createSlice({
  name: "orders",
  initialState: Initialstate,
  reducers: {
    setOrders: (state, action) => {
      state.error = action.payload.error;
      state.value = action.payload.value;
      state.loading = action.payload.loading;
      state.hasNext = action.payload.hasNext;
      state.page = action.payload.page;
      state.count = action.payload.count;
      state.pages = action.payload.pages;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(FetchOrders.rejected, (state, action) => {
      state.error = action.error as string;
      state.value = {};
      state.loading = false;
    });
    builder.addCase(FetchOrders.pending, (state, action) => {
      state.error = "";
      state.loading = true;
      state.value = {};
    });
    builder.addCase(FetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const orders: { Data: OrdersType[]; HasNext: boolean; Page: number; Count: number; Pages: number } = action.payload as any;
      state.count = orders.Count;
      state.page = orders.Page;
      state.hasNext = orders.HasNext;
      state.pages = orders.Pages;
      const tmp: any = {};
      orders.Data.forEach((order: any) => {
        tmp[order._id] = order;
      });
      state.value = tmp;
    });
    /******************************************************** */
    builder.addCase(FetchMoreOrders.pending, (state, action) => {
      state.error = "";
      state.loading = true;
    });
    builder.addCase(FetchMoreOrders.rejected, (state, action) => {
      state.error = action.error as string;
      state.loading = false;
    });
    builder.addCase(FetchMoreOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const orders: { Data: OrdersType[]; HasNext: boolean; Page: number; Count: number; Pages: number } = action.payload as any;

      const tmp: valueType = {};
      orders.Data.forEach((order) => {
        tmp[order._id] = order;
      });
      state.hasNext = orders.HasNext;
      state.page = orders.Page;
      state.count = orders.Count;
      state.pages = orders.Pages;

      state.value = Object.assign(state.value, tmp);
    });

    /******************************************************** */

    builder.addCase(FetchOrdersPage.pending, (state, action) => {
      state.error = "";
      state.loading = true;
    });
    builder.addCase(FetchOrdersPage.rejected, (state, action) => {
      state.error = action.error as string;
      state.loading = false;
    });
    builder.addCase(FetchOrdersPage.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const orders: { Data: OrdersType[]; HasNext: boolean; Page: number; Count: number; Pages: number } = action.payload as any;

      const tmp: valueType = {};
      orders.Data.forEach((order) => {
        tmp[order._id] = order;
      });
      state.hasNext = orders.HasNext;
      state.page = orders.Page;
      state.count = orders.Count;
      state.pages = orders.Pages;
      state.value = tmp;
    });
  },
});
export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
