import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedAdminRoute from "./protected/protected.admin.routes";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminSign = lazy(() => import("@/pages/admin/AdminSign"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Users = lazy(() => import("@/pages/admin/Users"));
const AdminCourse = lazy(() => import("@/pages/admin/admin.course"));
const AdminCategory = lazy(() => import("@/pages/admin/admin.category"));
const AdminCourseView = lazy(() => import("@/pages/admin/admin.course.view"));
const AdminMyCourse = lazy(() => import("@/pages/admin/admin.mycourse"));
const AdminCourseCreatePage = lazy(() => import("@/pages/admin/admin.course.create"));
const AdminCourseQuickView = lazy(() => import("@/pages/admin/admin.course.quick.view"));
const AdminEditCouse = lazy(() => import("@/pages/shared/course.edit.page"));
const AdminChatPage = lazy(() => import("@/pages/shared/chat.page"));
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
          { path: "courses/:id", element: <AdminCourseView /> },
          { path: "my-courses", element: <AdminMyCourse /> },
          { path: "my-courses/:id", element: <AdminCourseQuickView /> },
          { path: "create-course", element: <AdminCourseCreatePage /> },
          { path: "edit-course/:id", element: <AdminEditCouse /> },
          { path: "chat", element: <AdminChatPage /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
