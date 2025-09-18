// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// interface LearnerLoginRequest {
//   email: string;
//   password: string;
// }

// interface LearnerSignupRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// interface LoginAuthResponse {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: 'learner';
//     lastLogin:Date;
//     profileImg:string;
//     currentSubject:[string];

//   };
// }

// export interface SignupAuthResponse {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: 'learner';
//   };
// }

// export const learnerAuthApi = createApi({
//   reducerPath: 'learnerAuthApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/auth' }),
//   endpoints: (builder) => ({
//     loginLearner: builder.mutation<LoginAuthResponse, LearnerLoginRequest>({
//       query: (credentials) => ({
//         url: '/learner/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     signupLearner: builder.mutation<SignupAuthResponse, LearnerSignupRequest>({
//       query: (newUser) => ({
//         url: '/learner/signup',
//         method: 'POST',
//         body: newUser,
//       }),
//     }),
//   }),
// });

// export const { useLoginLearnerMutation, useSignupLearnerMutation } = learnerAuthApi;
