import LearnerHomeLayout from "@/components/LearnerHomeLayout";
import LearnerProfile from "@/pages/Learner/LearnerProfile";
import LearnerProfileLayout from "@/pages/Learner/LearnerProfileLayout";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const LearnerHome = lazy(() => import("@/pages/Learner/LearnerHome"));
// import LearnerLayout from "@/layouts/LearnerLayout";
// import LearnerHome from "@/pages/learner/Home";
// import LearnerCourses from "@/pages/learner/Courses";
// import LearnerProfile from "@/pages/learner/Profile";

const learnerRoutes: RouteObject[] = [
  {
    path: "/learner",
    element: <LearnerHomeLayout />, // main layout
    children: [
      { path: "home", element: <LearnerHome /> },
      // { path: "courses", element: <LearnerCourses /> },

      {
        path: "profile",
        element: <LearnerProfileLayout />, // 👈 nested layout
        children: [
          { index: true, element: <LearnerProfile /> }, // /learner/profile
          // { path: "settings", element: <ProfileSettings /> }, // /learner/profile/settings
          // { path: "security", element: <ProfileSecurity /> }, // /learner/profile/security
        ],
      },
    ],
  },
];

export default learnerRoutes;
