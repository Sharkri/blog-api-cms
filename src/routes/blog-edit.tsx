import { Post } from "@/types/Post";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogPostForm from "../components/blog/blog-post-form";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";

const { VITE_API_URL } = import.meta.env;
const token = Cookies.get("token");

export default function BlogEdit() {
  const { postId } = useParams();
  const [post, setPost] = useState<null | Post>(null);
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchPostById = async () => {
      if (!postId) return;
      const opts = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${VITE_API_URL}/api/posts/${postId}`, opts);
      setPost(res.data);
    };
    fetchPostById();
  }, [postId]);

  if (!user || !post) return null;

  const handleFormSubmit = async (formData: FormData) => {
    try {
      await axios.put(`${VITE_API_URL}/api/posts/${post._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Successfully edited blog post!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong... see logs");
    }
  };

  return (
    <BlogPostForm
      formAction="Edit Blog Post"
      post={post}
      onFormSubmit={handleFormSubmit}
    />
  );
}
