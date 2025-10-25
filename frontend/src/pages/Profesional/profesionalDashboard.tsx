import React from "react";
import { useGetDashboard } from "@/hooks/profesional/useGetDashboard";
import { Processing } from "./Processing";
import Verification from "./Verification";
const profesionalDashboard = () => {
  const { data: userData, isLoading, isError, error } = useGetDashboard();
  if (userData?.status === "processing") return <Processing />;
  if (userData?.status === "pending") return <Verification />;

  return (
    <>
      <div>Professionaal dashboard</div>
    </>
  );
};

export default profesionalDashboard;
