import AdminSign from "@/pages/admin/AdminSign";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const ForgotPassword = lazy(() => import("@/pages/common/ForgotPassword"));
const OtpVerification = lazy(() => import("@/pages/common/OtpVerification"));
const ResetPassword = lazy(() => import("@/pages/common/ResetPassword"));
const LearnerSign = lazy(() => import("@/pages/Learner/LearnerSign"));
const ProfesionalSign = lazy(() => import("@/pages/Profesional/ProfesionalSign"));

const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      { path: "learner", element: <LearnerSign /> },
      { path: "learner/forgot", element: <ForgotPassword role="learner" /> },
      { path: "learner/verify-otp", element: <OtpVerification /> },
      { path: "learner/reset-password", element: <ResetPassword /> },

      //profesional auth
      { path: "profesional", element: <ProfesionalSign /> },
      { path: "profesional/forgot", element: <ForgotPassword role="profesional" /> },
      { path: "profesional/verify-otp", element: <OtpVerification /> },
      { path: "profesional/reset-password", element: <ResetPassword /> },

      //admin
      { path: "admin", element: <AdminSign /> },
      // { path: "profesional/forgot", element: <ForgotPassword role="profesional" /> },
      // { path: "profesional/verify-otp", element: <OtpVerification /> },
      // { path: "profesional/reset-password", element: <ResetPassword /> },
    ],
  },
];

export default AuthRoutes;
