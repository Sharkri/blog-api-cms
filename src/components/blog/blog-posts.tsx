import { useEffect, useState } from "react";
import Spinner from "../ui/spinner";
import axios from "axios";
import Cookies from "js-cookie";
import { Post } from "@/types/Post";
import BlogPostCard from "./blog-post-card";

export default function BlogPosts() {
  const [posts, setPosts] = useState<null | Post[]>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { VITE_API_URL } = import.meta.env;
      const res = await axios.get(`${VITE_API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  if (posts == null)
    return (
      <div className="flex justify-center text-lg items-center gap-3 text-gray-600">
        Fetching blog posts...
        <Spinner />
      </div>
    );

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-8">
      {posts.map((post) => (
        <BlogPostCard post={post} key={post._id} />
      ))}
    </div>
  );
}
