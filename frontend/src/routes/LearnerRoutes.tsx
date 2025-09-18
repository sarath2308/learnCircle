import LearnerHome from "@/pages/Learner/LearnerHome";
import type { RouteObject } from "react-router-dom";

// import LearnerLayout from "@/layouts/LearnerLayout";
// import LearnerHome from "@/pages/learner/Home";
// import LearnerCourses from "@/pages/learner/Courses";
// import LearnerProfile from "@/pages/learner/Profile";

const learnerRoutes: RouteObject[] = [
  {
    path: "/learner",
    children: [
     
      { path: "home", element: <LearnerHome /> },

      
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

export default learnerRoutes;
