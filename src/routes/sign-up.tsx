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
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import Spinner from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().nonempty("Display name is required"),
});
type FormSchema = z.infer<typeof formSchema>;
type ErrorResponse = { msg: string; path: keyof FormSchema };

const { VITE_API_URL } = import.meta.env;

export default function SignUp() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", displayName: "" },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    try {
      const res = await axios.post(
        `${VITE_API_URL}/api/users/register`,
        values
      );
      const token = res.data;
      Cookies.set("token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      window.location.replace("/blog-api-cms");
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

  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="p-8">
      <Form {...form}>
        <h1 className="text-2xl font-bold mb-3 tracking-tight">Sign Up</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="max-w-xs"
                    placeholder="example@example.com"
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Must be at least 6 characters"
                    showing={showPassword}
                    onToggleShow={() => setShowPassword(!showPassword)}
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
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    className="max-w-xs"
                    placeholder="Enter display name"
                    {...field}
                    type="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full max-w-xs" disabled={loading}>
            {loading && <Spinner />} Sign Up
          </Button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
