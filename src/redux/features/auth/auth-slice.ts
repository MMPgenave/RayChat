import { createSlice } from "@reduxjs/toolkit";

export interface IAuth {
  user: {
    clientId: string;
    name: string;
  };
}

const initialState: IAuth = {
  user: { clientId: "", name: "" },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions;

export default authSlice.reducer;
