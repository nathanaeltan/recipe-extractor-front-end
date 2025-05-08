import { Link, useLocation } from "react-router-dom";
import { Home, List, Calendar } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 sm:px-6 z-10">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            isActive("/") ? "text-black" : "text-gray-400"
          }`}
        >
          <Home className="h-6 w-6" />
        </Link>

        <Link
          to="/recipes"
          className={`flex flex-col items-center p-2 ${
            isActive("/recipes") ? "text-black" : "text-gray-400"
          }`}
        >
          <List className="h-6 w-6" />
        </Link>

        <Link
          to="/meal-planner"
          className={`flex flex-col items-center p-2 ${
            isActive("/meal-planner") ? "text-black" : "text-gray-400"
          }`}
        >
          <Calendar className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
