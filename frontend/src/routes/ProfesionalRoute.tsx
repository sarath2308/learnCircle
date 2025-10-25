import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import ProfesionalLayout from "@/pages/Profesional/ProfesionalLayout";
import Verification from "@/pages/Profesional/Verification";
import { ROLE } from "@/contstant/role";

// ✅ Lazy import for better code-splitting
const ProfessionalDashboard = lazy(() => import("@/pages/Profesional/profesionalDashboard"));

// ✅ Wrap lazy components inside <Suspense> *in element, not in children array*
const professionalRoutes: RouteObject[] = [
  {
    path: `/${ROLE.PROFESSIONAL}`,
    element: <ProfesionalLayout />, // layout with sidebar/navbar
    children: [
      {
        path: "home",
        element: (
          <Suspense fallback={<div>Loading ...</div>}>
            <ProfessionalDashboard />
          </Suspense>
        ),
      },
    ],
  },
];

export default professionalRoutes;
