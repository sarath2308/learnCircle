import AdminSign from "@/pages/admin/AdminSign";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const ForgotPassword = lazy(() => import("@/pages/common/ForgotPassword"));
const ForgotOtpVerify = lazy(() => import("@/pages/common/ForgotOtpVerify"));
const SignupOtpVerify = lazy(() => import("@/pages/common/SignupOtpVerify"));
const ResetPassword = lazy(() => import("@/pages/common/ResetPassword"));
const LearnerSign = lazy(() => import("@/pages/Learner/LearnerSign"));
const ProfesionalSign = lazy(() => import("@/pages/Profesional/ProfesionalSign"));

const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      { path: "signup/verify-otp", element: <SignupOtpVerify /> },
      { path: "forgot/verify-otp", element: <ForgotOtpVerify /> },
      { path: "forgot", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "learner", element: <LearnerSign /> },

      //profesional auth
      { path: "profesional", element: <ProfesionalSign /> },

      //admin
      { path: "admin", element: <AdminSign /> },
      // { path: "profesional/forgot", element: <ForgotPassword role="profesional" /> },
      // { path: "profesional/verify-otp", element: <OtpVerification /> },
      // { path: "profesional/reset-password", element: <ResetPassword /> },
    ],
  },
];

export default AuthRoutes;
