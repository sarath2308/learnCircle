import React from "react";
import { useGetDashboard } from "@/hooks/profesional/useGetDashboard";
import Verification from "./Verification";
const ProfesionalDashboard = () => {
  const { data: userData, isLoading, isError, error } = useGetDashboard();
  if (isLoading) return <div>Loading..</div>;
  if (userData?.status === "pending") return <Verification />;

  return (
    <>
      <div>Welcome{userData?.user.name}</div>
    </>
  );
};

export default ProfesionalDashboard;
