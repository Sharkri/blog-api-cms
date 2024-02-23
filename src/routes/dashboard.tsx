import UserContext from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  if (!user) return null;

  return (
    <div>
      {user.role === "user" ? "You are not an admin...." : "Hiya heya haya"}
    </div>
  );
}
