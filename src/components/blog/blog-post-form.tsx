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
export type PostData = z.infer<typeof formSchema>;

export default function BlogPostForm({
  formAction,
  post,
  onFormSubmit,
}: {
  formAction: string;
  post?: PostData;
  onFormSubmit: (formData: PostData) => Promise<void>;
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
  const [currentTopic, setCurrentTopic] = useState("");

  const onSubmit = async (values: PostData) => {
    setLoading(true);
    await onFormSubmit(values);

    setLoading(false);
  };

  const addTopic = (topic: string) => {
    const topics = form.getValues("topics") || [];
    topic = topic.trim();
    if (!topic) return;
    const isDuplicate = topics.some(
      (t) => t.toLowerCase() === topic.toLowerCase()
    );
    if (!isDuplicate) form.setValue("topics", [...topics, topic]);
    setCurrentTopic("");
  };
  const removeTopic = (topicToRemove: string) => {
    const topics = form.getValues("topics");
    if (!topics) return;
    form.setValue(
      "topics",
      topics.filter((topic) => topic !== topicToRemove)
    );
  };
  function onTopicChange(value: string) {
    const allowedChars = /^$|^[A-Za-z0-9 _-]+$/;

    // if last text entered is double space or comma
    if (value.slice(-2) === "  " || value.slice(-1) === ",") {
      // remove the trailing comma before adding topic
      addTopic(value.replace(",", ""));
    } else if (allowedChars.test(value) && value.length <= 25) {
      setCurrentTopic(value);
    }
  }

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
            name="topics"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Topics</FormLabel>

                <div className="flex gap-5 flex-wrap">
                  {field.value?.map((topic) => (
                    <div
                      className="pl-2 py-1 bg-zinc-50 flex items-center gap-2 rounded-md"
                      key={topic}
                    >
                      <span className="text-[15px]">{topic}</span>
                      <button
                        type="button"
                        className="text-lg text-black/50 pr-2 hover:text-black transition-colors duration-300"
                        onClick={() => removeTopic(topic)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="e.g.: topic 1, topic 2"
                    value={currentTopic}
                    onChange={(e) => onTopicChange(e.target.value)}
                  />
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
