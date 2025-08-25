
import type { RouteObject } from "react-router-dom";
import LearnerOtpVerification from "@/pages/Learner/LearnerOtpVerification";

const learnerRoutes: RouteObject = {
  path: "/learner",
  children: [
    // no-layout child
    { path: "verify_otp", element: <LearnerOtpVerification /> },

    // layout-wrapped children
    {
      // element: <LearnerLayout />,
      children: [
        // { path: "home", element: <LearnerHome /> },
        // { path: "courses", element: <LearnerCourses /> },
        // { path: "profile", element: <LearnerProfile /> },
      ],
    },
  ],
};
export default learnerRoutes