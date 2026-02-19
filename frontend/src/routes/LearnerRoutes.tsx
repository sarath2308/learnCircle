import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedLearnerRoute from "./protected/protected.learner.routes";

const LearnerHomeLayout = lazy(() => import("@/components/learner/LearnerHomeLayout"));
const LearnerProfile = lazy(() => import("@/pages/Learner/LearnerProfile"));
const Homepage = lazy(() => import("@/pages/Learner/LearnerHome"));
const LearnerCoursePage = lazy(() => import("@/pages/Learner/learner.course.page"));
const LearnerAllCoursePage = lazy(() => import("@/pages/Learner/learner.all.course"));
const Professionals = lazy(() => import("@/pages/Learner/learner.professionals.page"));
const LearnerSlotPage = lazy(() => import("@/pages/Learner/learner.slot.page"));
const LearnerProfileLayout = lazy(() => import("@/components/learner/learner.profile.layout"));
const LearnerBookingsPage = lazy(() => import("@/pages/Learner/learner.profile.myBookings"));
const VideoCallPage = lazy(() => import("@/pages/shared/video.room.page"));
const RandomMatchPage = lazy(() => import("@/pages/Learner/learner.random.match.page"));
const EventPage = lazy(()=>import("@/pages/Learner/learner.event.page"));
const AboutPage = lazy(()=> import("@/pages/Learner/learner.about.page"));

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
            children: [
              { index: true, element: <LearnerProfile /> },
              { path: "bookings", element: <LearnerBookingsPage /> },
              { path: "settings", element: <LearnerProfile /> },
            ],
          },
          { path: "events", element: <EventPage /> },
          { path: "about", element: <AboutPage /> },
          { path: "course/:courseId", element: <LearnerCoursePage /> },
          { path: "courses", element: <LearnerAllCoursePage /> },
          { path: "professionals", element: <Professionals /> },
          { path: "professionals/:instructorId", element: <LearnerSlotPage /> },
          { path: "video-call/:roomId", element: <VideoCallPage /> },
          { path: "random-match", element: <RandomMatchPage /> },
        ],
      },
    ],
  },
];

export default learnerRoutes;
