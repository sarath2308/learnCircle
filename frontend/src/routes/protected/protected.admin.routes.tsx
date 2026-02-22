import { ROLE } from "@/contstant/role";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);

  if (!user) return <Navigate to="/" replace />; // not logged in
  if (user.role !== ROLE.ADMIN) return <Navigate to="/" replace />; // wrong role

  return <Outlet />;
}
