import React from "react";
import { useGetDashboard } from "@/hooks/profesional/useGetDashboard";
import Verification from "./Verification";
import { Processing } from "./Processing";
import { Rejected } from "./Rejected";
const ProfesionalDashboard = () => {
  const { data: userData, isLoading, isError, error } = useGetDashboard();
  if (isLoading) return <div>Loading..</div>;
  if (userData?.status === "pending") return <Verification />;
  if (userData?.status === "processing") return <Processing />;
  if(userData?.status ===  "rejected") return <Rejected />

  return (
    <>
      <div>Welcome{userData?.user.name}</div>
    </>
  );
};

export default ProfesionalDashboard;
