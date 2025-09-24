import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ICurrentUserState {
  currentUser?: {
  email: string;
  name: string;
  role: string;
  passwordHash?:Boolean;
  profileImg?: string;
  joinedAt?: Date;
  lastLogin?: Date;
}
}

const initialState: ICurrentUserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = undefined;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
