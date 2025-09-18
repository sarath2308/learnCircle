import { useNavigate } from "react-router-dom";

const LearnerHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Learner Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </nav>
  );
};

export default LearnerHome;
