
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/services/auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status and redirect accordingly
    if (isAuthenticated()) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
