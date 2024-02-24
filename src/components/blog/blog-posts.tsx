import { useEffect, useState } from "react";
import Spinner from "../ui/spinner";
import axios from "axios";
import Cookies from "js-cookie";
import { Post } from "@/types/Post";
import BlogPostCard from "./blog-post-card";
import { toast } from "sonner";

const { VITE_API_URL } = import.meta.env;

export default function BlogPosts() {
  const [posts, setPosts] = useState<null | Post[]>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${VITE_API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    };
    fetchPosts();
  }, [token]);

  const handleDeletePost = async (id: string) => {
    if (!posts) return;
    try {
      await axios.delete(`${VITE_API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
      toast.success("Deleted post!");
    } catch (error) {
      console.error(error);
      toast.error("Oops! Something went wrong...");
    }
  };

  if (posts == null)
    return (
      <div className="flex justify-center text-lg items-center gap-3 text-gray-600">
        Fetching blog posts...
        <Spinner />
      </div>
    );

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
      {posts.map((post) => (
        <BlogPostCard
          post={post}
          key={post._id}
          onDeletePost={() => handleDeletePost(post._id)}
        />
      ))}
    </div>
  );
}
