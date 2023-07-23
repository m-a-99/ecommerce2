import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserInfoType } from "../types/UserInfoType";

const initialState: { loading: boolean; value: UserInfoType; error: string } = {
  loading: true,
  value: {},
  error: "",
};

export const FetchUserInfo = createAsyncThunk("userInfo/FetchUserInfo",(token: string) => {
  return new Promise(async (res, rej) => {
    try {
      const resdata = await fetch("http://nginx-proxy/user-service/profile", { method: "GET", headers: { Authorization: token } });
      if (!resdata.ok) {
        rej(await resdata.text());
      } else res(resdata.json());
    } catch (e:any) {
      rej(e)
    }
  });
});


const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.error = action.payload.error;
      state.loading=action.payload.loading;
      state.value=action.payload.value
    },
    setUserInfoValue:(state,action)=>{
      state.error="";
      state.value=action.payload
      state.loading=false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(FetchUserInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(FetchUserInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error as string;
      state.value = {};
    });
    builder.addCase(FetchUserInfo.fulfilled, (state, action) => {
      state.value = action.payload as UserInfoType;
      state.loading = false;
      state.error = "";
    });
  },
});
export const { setUserInfo,setUserInfoValue } = userInfoSlice.actions;
export default userInfoSlice.reducer;
