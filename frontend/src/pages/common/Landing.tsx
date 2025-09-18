import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left side - Logo/Brand */}
      <div className="text-xl font-bold">MyApp</div>

      {/* Right side - Auth buttons */}
      <div className="flex items-center space-x-4">
        <Link to="/auth">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/auth">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Signup
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Landing;
