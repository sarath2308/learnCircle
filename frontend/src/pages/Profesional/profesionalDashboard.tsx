import React from "react";
import { useGetDashboard } from "@/hooks/profesional/useGetDashboard";
import { Processing } from "./Processing";
const profesionalDashboard = () => {
  const { data: userData, isLoading, isError, error } = useGetDashboard();
  if (userData?.status === "processing") return <Processing />;

  return <></>;
};

export default profesionalDashboard;
