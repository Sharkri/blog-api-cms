import { Image, Post } from "@/types/Post";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";

const getImageUrl = (image: Image) => {
  const base64 = btoa(
    image.data.data.reduce((data, byte) => data + String.fromCharCode(byte), "")
  );

  return `data:image/png;base64,${base64}`;
};

export default function BlogPostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          Created at {format(new Date(post.createdAt), "MMMM dd, yyyy")}
        </CardDescription>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {post.image && <img src={getImageUrl(post.image)} alt={post.title} />}
      </CardContent>
    </Card>
  );
}
