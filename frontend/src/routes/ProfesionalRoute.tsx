import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import Verification from "@/pages/Profesional/Verification";
import { ROLE } from "@/contstant/role";
import ProtectedProfessionalRoute from "./protected/protected.professional.routes";

const ProfessionalDashboard = lazy(() => import("@/pages/Profesional/profesionalDashboard"));
const ProfessionalLayout = lazy(() => import("@/pages/Profesional/ProfesionalLayout"));

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
        ],
      },
    ],
  },
];

export default professionalRoutes;
