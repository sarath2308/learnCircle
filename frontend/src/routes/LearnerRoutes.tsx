import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedLearnerRoute from "./protected/protected.learner.routes";

const LearnerHomeLayout = lazy(() => import("@/components/learner/LearnerHomeLayout"));
const LearnerProfile = lazy(() => import("@/pages/Learner/LearnerProfile"));
const Homepage = lazy(()=> import("@/pages/Learner/LearnerHome"));
const LearnerCoursePage = lazy(()=>import("@/pages/Learner/learner.course.page"));
const LearnerAllCoursePage = lazy(()=> import("@/pages/Learner/learner.all.course"));
const Professionals = lazy(()=> import("@/pages/Learner/learner.professionals.page"))
const LearnerSlotPage = lazy(() => import("@/pages/Learner/learner.slot.page"));

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
            element: <LearnerProfile />,
          },
            { path: "course/:courseId", element: <LearnerCoursePage /> },
             { path: "courses", element: <LearnerAllCoursePage /> },
              { path: "professionals", element: <Professionals /> },
               { path: "professionals/:instructorId", element: <LearnerSlotPage /> },
        ],
      },
    ],
  },
];

export default learnerRoutes;
