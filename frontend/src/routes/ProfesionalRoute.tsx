import ProfesionalLayout from "@/pages/Profesional/ProfesionalLayout";
import type { RouteObject } from "react-router-dom";
import { React } from "react";
import ProfessionalForm from "@/pages/Profesional/ProfesionalLayout";
import Verification from "@/pages/Profesional/Verification";
import { ROLE } from "@/contstant/role";
// import ProfessionalLayout from "@/layouts/ProfessionalLayout";
// import ProfessionalDashboard from "@/pages/professional/Dashboard";
// import ProfessionalCourses from "@/pages/professional/Courses";

const professionalRoutes: RouteObject[] = [
  {
    path: `/${ROLE.PROFESSIONAL}`,
    element: <ProfesionalLayout />, // layout with navbar/sidebar
    // children: [
    //   { index: true, element: <ProfessionalDashboard /> }, // /professionals
    //   { path: "courses", element: <ProfessionalCourses /> }, // /professionals/courses
    //   // add more children as needed
    // ],
  },
];

export default professionalRoutes;
