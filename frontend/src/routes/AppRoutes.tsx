import { useRoutes } from "react-router-dom";

// Routes
import LearnerRoutes from "./LearnerRoutes";

import Auth from "@/pages/Auth";
// import LandingPage from "./pages/LandingPage";

function AppRoutes() {
  const routes = [
    { path: "/", element: <Auth /> },
    ...LearnerRoutes,
  ];
  return useRoutes(routes);
}

export default AppRoutes