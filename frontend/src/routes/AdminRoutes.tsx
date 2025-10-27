import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { React } from "react";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminSign = lazy(() => import("@/pages/admin/AdminSign"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Users = lazy(() => import("@/pages/admin/Users"));
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
          { path: "users", element: <Users /> },
          //   // { path: "settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
