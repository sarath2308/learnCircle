import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminSign = lazy(() => import("@/pages/admin/AdminSign"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Users = lazy(() => import("@/pages/admin/Users"));
const AdminCourse = lazy(() => import("@/pages/admin/admin.course"));
const AdminCategory = lazy(()=> import("@/pages/admin/admin.category"))

import ProtectedAdminRoute from "./protected/protected.admin.routes";

const AdminRoutes: RouteObject[] = [
  // PUBLIC: Admin Login
  {
    path: "/admin",
    element: <AdminSign />, // <-- login page OUTSIDE protected route
  },

  // PROTECTED: Everything else
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />, // layout for all protected admin pages
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <Users /> },
          { path: "courses", element: <AdminCourse /> },
          { path: "category", element: <AdminCategory /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
