import { createSlice } from "@reduxjs/toolkit";

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    email: "",
    role: "",
    tempToken: "",
  },
  reducers: {
    setSignupData: (state, action) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.tempToken = action.payload.token || "";
    },
    clearSignupData: (state) => {
      state.email = "";
      state.role = "";
      state.tempToken = "";
    },
  },
});

export const { setSignupData, clearSignupData } = signupSlice.actions;
export default signupSlice.reducer;
