import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ProfLoginRequest {
  email: string;
  password: string;
}

interface ProfSignupRequest {
  name: string;
  email: string;
  password: string;
}

interface ProfAuthResponse {
  profesional: {
   id: string;
   name: string;
   email: string;
   role: string;
   joinedAt:Date;
  };
}

export const ProfAuthApi = createApi({
  reducerPath: 'profAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  endpoints: (builder) => ({
    loginProf: builder.mutation<ProfAuthResponse, ProfLoginRequest>({
      query: (credentials) => ({
        url: '/learner/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signupProf: builder.mutation<ProfAuthResponse, ProfSignupRequest>({
      query: (newUser) => ({
        url: '/learner/signup',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
});

export const { useSignupProfMutation, useLoginProfMutation } = ProfAuthApi;
