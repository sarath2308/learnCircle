import { useRoutes } from "react-router-dom";

// Routes
import LearnerRoutes from "./LearnerRoutes";
import AuthRoutes from "./AuthRoutes";

import Auth from "@/pages/Auth";
// import LandingPage from "./pages/LandingPage";

function AppRoutes() {
  const routes = [
    { path: "/", element: <Auth /> },
    ...LearnerRoutes,
    ...AuthRoutes
  ];
  return useRoutes(routes);
}

export default AppRoutes