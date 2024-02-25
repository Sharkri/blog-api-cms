import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import getImageUrl from "@/lib/blog/get-image-url";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  topics: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  blogContents: z.string().min(1, "Blog contents cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  image: z.any(),
});
type PostData = z.infer<typeof formSchema>;

export default function BlogPostForm({
  formAction,
  post,
  onFormSubmit,
}: {
  formAction: string;
  post?: PostData;
  onFormSubmit: (formData: FormData) => void;
}) {
  const form = useForm<PostData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", blogContents: "", description: "", ...post },
  });

  const [previewImage, setPreviewImage] = useState<string | undefined>(
    post?.image ? getImageUrl(post.image) : undefined
  );
  const [file, setFile] = useState<File | undefined>();

  const onSubmit = async (newPost: PostData) => {
    console.log("yello?");
    if (file) {
      let message = "";
      if (file.size > MAX_FILE_SIZE) message = "Max image size is 5MB.";
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
        message = "Only .jpg/jpeg, .png and .webp formats are supported.";
      if (message) return form.setError("image", { message });
    }

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("blogContents", newPost.blogContents);
    formData.append("isPublished", (newPost.isPublished || false).toString());
    if (file) formData.append("image", file);
    console.log("yello 2?");
    onFormSubmit(formData);
    console.log("yello 3?");
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <h1 className="text-2xl font-bold mb-4">{formAction}</h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-xs"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blogContents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Contents</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                <FormLabel>Thumbnail</FormLabel>
                {previewImage && <img src={previewImage} alt="" />}
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === "string")
                          setPreviewImage(reader.result);
                      };
                      const file = e.target.files?.[0];
                      if (file) {
                        reader.readAsDataURL(file);
                        setFile(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="leading-none">Published</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {formAction}
          </Button>
        </form>
      </Form>
    </div>
  );
}
