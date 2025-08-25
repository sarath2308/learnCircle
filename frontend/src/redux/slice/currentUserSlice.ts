import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ICurrentUserState {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: 'learner' | 'professional' | 'admin';
    courses?: string[];
    skills?: string[];
    permissions?: string[];
    token?: string;
  };
}

const initialState: ICurrentUserState = {};

const userSlice = createSlice({
  name: 'user',
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
