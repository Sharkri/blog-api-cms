import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import Spinner from "../ui/spinner";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { User } from "@/types/User";
import UserAvatar from "../ui/user-avatar";
import { Input } from "../ui/input";
import getImageUrl from "@/lib/blog/get-image-url";

const MAX_FILE_SIZE = 4_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const passwordSchema = z.object({
  displayName: z.string().min(1, "Current password is required"),
  pfp: z
    .any()
    .refine(
      (img) => !img || img.size <= MAX_FILE_SIZE,
      "Max image size is 5MB."
    )
    .refine(
      (img) => !img || ACCEPTED_IMAGE_TYPES.includes(img.type),
      "Only .jpg/jpeg, .png and .webp formats are supported."
    ),
});
type PasswordSchema = z.infer<typeof passwordSchema>;
type ErrorResponse = { msg: string; path: keyof PasswordSchema };

const { VITE_API_URL } = import.meta.env;

export default function UpdateAccountDetailsDialog({ user }: { user: User }) {
  const form = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { displayName: user.displayName },
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  async function onSubmit({ pfp, displayName }: PasswordSchema) {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("pfp", pfp);

      await axios.put(`${VITE_API_URL}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Successfully updated account details!");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const errors = error.response?.data.errors as ErrorResponse[];
        if (errors)
          errors.map((err) => form.setError(err.path, { message: err.msg }));
      }
    } finally {
      setLoading(false);
    }
  }

  const [previewImage, setPreviewImage] = useState<null | string>(
    user.pfp && getImageUrl(user.pfp)
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className="w-full space-x-2 flex justify-between text-sm group">
        <div>
          <p className="text-left">Profile information</p>
          <div className="text-xs text-gray-500 mt-1">
            Edit your photo, name, bio, etc.
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 text-sm line-clamp-1 break-all group-hover:text-gray-800">
            {user.displayName}
          </span>
          <UserAvatar user={user} className="h-6 w-6 ml-2" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <h2 className="text-xl font-bold mb-5">Update account details</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="pfp"
              render={({ field }) => (
                <FormItem className="grid w-full max-w-xs items-center gap-1.5">
                  <FormLabel className="">Profile picture</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormLabel className="flex items-center gap-4">
                      <img
                        src={previewImage || "https://placehold.co/80x80/"}
                        alt=""
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <span className="text-green-700 cursor-pointer">
                        Update
                      </span>
                    </FormLabel>

                    <button
                      type="button"
                      className="text-red-700 text-sm"
                      onClick={() => {
                        setPreviewImage(null);
                        form.setValue("pfp", null);
                      }}
                    >
                      Remove
                    </button>
                  </div>

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
                          field.onChange(file);
                        }
                      }}
                      className="hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Your display name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="ghost"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner />}
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
