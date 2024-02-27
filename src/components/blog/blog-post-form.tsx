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
import Editor from "./blog-editor";
import Spinner from "../ui/spinner";

const formSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  topics: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  blogContents: z.string().min(1, "Blog contents cannot be empty"),
});
type PostData = z.infer<typeof formSchema>;

export default function BlogPostForm({
  formAction,
  post,
  onFormSubmit,
}: {
  formAction: string;
  post?: PostData;
  onFormSubmit: (formData: FormData) => Promise<void>;
}) {
  const form = useForm<PostData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      blogContents: "",
      ...post,
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: PostData) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("blogContents", values.blogContents);
    formData.append("isPublished", (!!values.isPublished).toString());
    await onFormSubmit(formData);

    setLoading(false);
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <h1 className="text-2xl font-bold mb-4">{formAction}</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Your blog title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="blogContents"
            render={({ field }) => (
              <FormItem className="max-w-4xl">
                <FormLabel>Blog Content</FormLabel>
                <FormControl>
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="max-w-xs flex items-center space-x-2 space-y-0">
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

          <Button type="submit" className="max-w-xs w-full" disabled={loading}>
            {loading && <Spinner />}
            {formAction}
          </Button>
        </form>
      </Form>
    </div>
  );
}
