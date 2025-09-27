import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ICurrentUser {
  email: string;
  name: string;
  role: string;
  passwordHash?: boolean;
  profileImg?: string;
  joinedAt?: Date;
  lastLogin?: Date;
}
export interface ICurrentUserState {
  currentUser?: ICurrentUser;
}
const initialState: ICurrentUserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<ICurrentUser>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = undefined;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
