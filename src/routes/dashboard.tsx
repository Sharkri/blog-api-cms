import UserContext from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogPosts from "../components/blog/blog-posts";

export default function Dashboard() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  if (!user) return null;

  return (
    <div className="p-8">
      {user.role === "user" ? (
        <p className="text-gray-600 text-center">
          Hmm, it seems you aren't authorized to create posts. If you think this
          is a mistake - it probably isn't.
        </p>
      ) : (
        <BlogPosts />
      )}
    </div>
  );
}
