import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ICurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImg?: string;
}
export interface ICurrentUserState {
  currentUser?: ICurrentUser;
}
const initialState: ICurrentUserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Partial<ICurrentUser>>) => {
      if (!state.currentUser) {
        state.currentUser = { ...action.payload } as ICurrentUser;
      } else {
        Object.assign(state.currentUser, action.payload);
      }
    },
    clearCurrentUser: (state) => {
      state.currentUser = undefined;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
