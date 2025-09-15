import ForgotPassword from "@/pages/common/ForgotPassword";
import OtpVerification from "@/pages/common/OtpVerification";
import ResetPassword from "@/pages/common/ResetPassword";
import LearnerSign from "@/pages/Learner/LearnerSign";
import type { RouteObject } from "react-router-dom";
// import LearnerLayout from "@/layouts/LearnerLayout";
// import LearnerHome from "@/pages/learner/Home";
// import LearnerCourses from "@/pages/learner/Courses";
// import LearnerProfile from "@/pages/learner/Profile";

const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
     
      { path: "learner", element: <LearnerSign/> },
       { path: "learner/forgot", element: <ForgotPassword role="learner"/> },
       { path: "learner/verify-otp", element: <OtpVerification /> },
         { path: "learner/reset-password", element:<ResetPassword /> },

      
      {
        element: <div>{/* LearnerLayout can go here */}</div>,
        children: [
          // { path: "home", element: <LearnerHome /> },
          // { path: "courses", element: <LearnerCourses /> },
          // { path: "profile", element: <LearnerProfile /> },
        ],
      },
    ],
  },
];

export default AuthRoutes;