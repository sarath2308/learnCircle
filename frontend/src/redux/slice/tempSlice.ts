import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface UserData{
  name: string;
  email: string;
  role: 'learner'|'profesional'|'admin';
}

interface tempState {
  user: UserData | null;
}

const initialState: tempState = {
  user: null,
};

const tempSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, updateUser, clearUser } = tempSlice.actions;
export default tempSlice.reducer;
