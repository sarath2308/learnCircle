import { BrowserRouter, useRoutes } from "react-router-dom";

// Routes
import LearnerRoutes from "./LearnerRoutes";
import ProfessionalRoutes from "./ProfesionalRoute";
import AdminRoutes from "./AdminRoutes";

import Auth from "@/pages/Auth";
// import LandingPage from "./pages/LandingPage";

function AppRoutes() {
  const routes = [
    { path: "/", element: <Auth /> },
    LearnerRoutes,
    ProfessionalRoutes,
    AdminRoutes,
  ];
  return useRoutes(routes);
}

export default AppRoutes