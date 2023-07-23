import { configureStore } from "@reduxjs/toolkit";
import cartRecucer from "./cart";
import userInfoReducer from "./userInfo"
import orderSlice from "./orders"

import productsReducer from "./products";
// const store = () =>
//   configureStore({
//     reducer: {
//       userInfo: userInforeducer,
//       cart: cartRecucer,
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false,
//       }),
//   });


export const store = configureStore({
  reducer: {
    cart: cartRecucer,
    userInfo: userInfoReducer,
    products: productsReducer,
    orders: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
// export default the store

// export type StoreType = ReturnType<typeof store>;

// export type RootState = ReturnType<StoreType["getState"]>;
// export type AppDispatch = ReturnType<StoreType["dispatch"]>;

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
