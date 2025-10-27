import { useGetAdminDashboard } from "@/hooks/admin/dashboard/useGetAdminDashboard";
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: userData, isError } = useGetAdminDashboard();
  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
