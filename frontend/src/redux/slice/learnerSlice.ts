// import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import type { SignupAuthResponse } from "../api/learner/learnerAuth";


// export interface UserData extends SignupAuthResponse {
//   id: string;
//   name: string;
//   email: string;
//   role: 'learner';
// }

// interface LearnerState {
//   user: UserData | null;
// }

// const initialState: LearnerState = {
//   user: null,
// };

// const learnerSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<UserData>) => {
//       state.user = action.payload;
//     },
//     updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//       }
//     },
//     clearUser: (state) => {
//       state.user = null;
//     },
//   },
// });

// export const { setUser, updateUser, clearUser } = learnerSlice.actions;
// export default learnerSlice.reducer;
