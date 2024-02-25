import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Post } from "@/types/Post";
import { useState } from "react";
import Spinner from "../ui/spinner";

export default function BlogDeleteButton({
  post,
  onDeletePost,
}: {
  post: Post;
  onDeletePost: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="flex gap-1.5" variant="outline" size="sm">
          <TrashIcon className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete "{post.title}"?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently erase this post
            and its data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={async () => {
              setLoading(true);
              await onDeletePost();
              setOpen(false);
              setLoading(false);
            }}
            disabled={loading}
          >
            {loading && <Spinner />} Delete Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
