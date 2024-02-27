import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogPostForm from "../../components/blog/blog-post-form";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";

const { VITE_API_URL } = import.meta.env;
const token = Cookies.get("token");

export default function BlogCreate() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);
  if (!user) return null;

  const handleFormSubmit = async (formData: FormData) => {
    try {
      await axios.post(`${VITE_API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Successfully created blog post!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong... see logs");
    }
  };

  return (
    <BlogPostForm
      formAction="Create Blog Post"
      onFormSubmit={handleFormSubmit}
    />
  );
}
