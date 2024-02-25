import { Post } from "@/types/Post";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { PencilIcon } from "@heroicons/react/24/solid";
import BlogDeleteButton from "./blog-delete-button";
import { Link } from "react-router-dom";
import getImageUrl from "@/lib/blog/get-image-url";

export default function BlogPostCard({
  post,
  onDeletePost,
}: {
  post: Post;
  onDeletePost: () => Promise<void>;
}) {
  return (
    <Card className="relative flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          Authored by {post.author.displayName} at{" "}
          {format(new Date(post.createdAt), "M/dd/yy")}
          <br />
          {post.isPublished ? (
            <span className="text-green-600">Published</span>
          ) : (
            <span className="text-red-600">Unpublished</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-gray-600">{post.description}</p>
        {post.image && <img src={getImageUrl(post.image)} alt={post.title} />}
        <div className="flex gap-4 flex-wrap justify-center">
          <Button className="flex gap-1.5" size="sm" asChild>
            <Link to={`/posts/${post._id}/edit`}>
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
          </Button>

          <BlogDeleteButton post={post} onDeletePost={onDeletePost} />
        </div>
      </CardContent>
    </Card>
  );
}
