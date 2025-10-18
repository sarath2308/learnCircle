import { createSlice } from "@reduxjs/toolkit";

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    email: "",
    role: "",
  },
  reducers: {
    setSignupData: (state, action) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearSignupData: (state) => {
      state.email = "";
      state.role = "";
    },
  },
});

export const { setSignupData, clearSignupData } = signupSlice.actions;
export default signupSlice.reducer;
