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
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { PasswordInput } from "../ui/password-input";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(80, "Max 80 characters"),
});
type PasswordSchema = z.infer<typeof passwordSchema>;
type ErrorResponse = { msg: string; path: keyof PasswordSchema };

const { VITE_API_URL } = import.meta.env;

export default function ChangePasswordDialog({ email }: { email: string }) {
  const form = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const token = Cookies.get("token");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  async function onSubmit(formData: PasswordSchema) {
    setLoading(true);
    try {
      await axios.put(`${VITE_API_URL}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      form.reset({ oldPassword: "", newPassword: "" });
      toast.success("Successfully updated password!");
      setOpen(false);
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

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className="w-full space-x-2 flex justify-between text-sm group">
        <p>Change password</p>
        <LockClosedIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <h2 className="text-xl font-bold mb-5">Update password</h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input
              hidden
              value={email}
              type="email"
              autoComplete="email"
              readOnly
            />

            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="current-password"
                      placeholder="Your current password"
                      showing={showPassword}
                      onToggleShow={toggleShowPassword}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      placeholder="Must be at least 6 characters"
                      showing={showPassword}
                      onToggleShow={toggleShowPassword}
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
