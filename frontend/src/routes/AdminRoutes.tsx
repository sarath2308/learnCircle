import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminSign = lazy(() => import("@/pages/admin/AdminSign"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
// you can add other admin pages like:
// const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
// const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    children: [
      {
        index: true, // default route -> /admin
        element: <AdminSign />,
      },
      {
        path: "",
        element: <AdminLayout />, // shared layout
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          //   // Example:
          //   // { path: "users", element: <AdminUsers /> },
          //   // { path: "settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
