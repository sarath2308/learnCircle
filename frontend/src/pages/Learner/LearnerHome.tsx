import { useGetHome } from "@/hooks/learner/home/useGetHome";
import React from "react";
import toast from "react-hot-toast";

const LearnerHome = () => {
  const { data } = useGetHome();
  return <div>LearnerHome</div>;
};

export default LearnerHome;
