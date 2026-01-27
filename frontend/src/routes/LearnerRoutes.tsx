import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedLearnerRoute from "./protected/protected.learner.routes";
const LearnerHome = lazy(() => import("@/pages/Learner/LearnerHome"));
const LearnerHomeLayout = lazy(() => import("@/components/LearnerHomeLayout"));
const LearnerProfile = lazy(() => import("@/pages/Learner/LearnerProfile"));
const LearnerProfileLayout = lazy(() => import("@/pages/Learner/LearnerProfileLayout"));
const Homepage = lazy(()=> import("@/pages/Learner/LearnerHome"));
const LearnerCoursePage = lazy(()=>import("@/pages/Learner/learner.course.page"));
const learnerRoutes: RouteObject[] = [
  {
    element: <ProtectedLearnerRoute />, // PROTECT EVERYTHING UNDER /learner
    children: [
      {
        path: "/learner",
        element: <LearnerHomeLayout />,
        children: [
          { path: "home", element: <Homepage /> },
          {
            path: "profile",
            element: <LearnerProfileLayout />,
            children: [{ index: true, element: <LearnerProfile /> }],
          },
            { path: "course/:courseId", element: <LearnerCoursePage /> },
        ],
      },
    ],
  },
];

export default learnerRoutes;
