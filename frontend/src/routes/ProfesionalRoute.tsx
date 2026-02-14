import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import Verification from "@/pages/Profesional/Verification";
import { ROLE } from "@/contstant/role";
import ProtectedProfessionalRoute from "./protected/protected.professional.routes";
import AvailabilityManager from "@/pages/Profesional/Professional.schedule.page";

const ProfessionalDashboard = lazy(() => import("@/pages/Profesional/profesionalDashboard"));
const ProfessionalLayout = lazy(() => import("@/pages/Profesional/ProfesionalLayout"));
const ProfessionalMyCourse = lazy(() => import("@/pages/Profesional/professional.course"));
const ProfessionalCreateCourse = lazy(
  () => import("@/pages/Profesional/professional.create.course"),
);
const ProfessionalViewCourse = lazy(() => import("@/pages/Profesional/professional.view.course"));
const ProfessionalSessionBooking = lazy(
  () => import("@/pages/Profesional/Professional.session.list"),
);
const VideoCallPage = lazy(() => import("@/pages/shared/video.room.page"));
const ChatPage = lazy(() => import("@/components/shared/chat.component"));
const professionalRoutes: RouteObject[] = [
  {
    element: <ProtectedProfessionalRoute />,
    children: [
      {
        path: `/${ROLE.PROFESSIONAL}`,
        element: (
          <Suspense fallback={<div>Loading Layout...</div>}>
            <ProfessionalLayout />
          </Suspense>
        ),
        children: [
          {
            path: "home",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProfessionalDashboard />
              </Suspense>
            ),
          },
          {
            path: "verification",
            element: <Verification />,
          },
          {
            path: "my-courses",
            element: <ProfessionalMyCourse />,
          },
          {
            path: "my-courses/:id",
            element: <ProfessionalViewCourse />,
          },
          {
            path: "schedule",
            element: <AvailabilityManager />,
          },
          {
            path: "create-course",
            element: <ProfessionalCreateCourse />,
          },
          {
            path: "sessions",
            element: <ProfessionalSessionBooking />,
          },
          {
            path: "video-call/:roomId",
            element: <VideoCallPage />,
          },
          {
            path: "chat",
            element: <VideoCallPage />,
          },
        ],
      },
    ],
  },
];

export default professionalRoutes;
