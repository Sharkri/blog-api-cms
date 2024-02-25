import { Post } from "@/types/Post";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditForm from "./blog-edit-form";
import UserContext from "@/context/UserContext";

const { VITE_API_URL } = import.meta.env;

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
      const res = await axios.get(`${VITE_API_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      setPost(res.data);
    };
    fetchPostById();
  }, [postId]);

  if (!user || post === null) return null;

  return <BlogEditForm post={post} />;
}
