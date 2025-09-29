import { useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Routes
import LearnerRoutes from "./LearnerRoutes";
import AuthRoutes from "./AuthRoutes";
import professionalRoutes from "./ProfesionalRoute";
const Landing = lazy(() => import("@/pages/common/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
// import LandingPage from "./pages/LandingPage";

function AppRoutes() {
  const routes = [
    { path: "/", element: <Landing /> },
    { path: "/auth", element: <Auth /> },
    ...LearnerRoutes,
    ...AuthRoutes,
    ...professionalRoutes,
  ];
  return <Suspense fallback={<div>loading....</div>}>{useRoutes(routes)}</Suspense>;
}

export default AppRoutes;
