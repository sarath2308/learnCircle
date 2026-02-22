import { ROLE } from "@/contstant/role";
import AdminSign from "@/pages/admin/AdminSign";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const ForgotPassword = lazy(() => import("@/pages/shared/ForgotPassword"));
const ForgotOtpVerify = lazy(() => import("@/pages/shared/ForgotOtpVerify"));
const SignupOtpVerify = lazy(() => import("@/pages/shared/SignupOtpVerify"));
const ResetPassword = lazy(() => import("@/pages/shared/ResetPassword"));
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
      { path: ROLE.LEARNER, element: <LearnerSign /> },

      //profesional auth
      { path: ROLE.PROFESSIONAL, element: <ProfesionalSign /> },

      //admin
      { path: ROLE.ADMIN, element: <AdminSign /> },
      // { path: "profesional/forgot", element: <ForgotPassword role="profesional" /> },
      // { path: "profesional/verify-otp", element: <OtpVerification /> },
      // { path: "profesional/reset-password", element: <ResetPassword /> },
    ],
  },
];

export default AuthRoutes;
