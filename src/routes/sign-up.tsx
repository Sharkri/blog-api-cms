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
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().nonempty("Display name is required"),
});

type ErrorResponse = {
  msg: string;
  path: "email" | "password" | "displayName";
};

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });
  const navigate = useNavigate();
  const { VITE_API_URL } = import.meta.env;

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

      navigate("/");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const errors = error.response?.data.errors as ErrorResponse[];

        if (errors) {
          errors.map((err) => {
            form.setError(err.path, { message: err.msg });
          });
        }
      }
    }
  }

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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    className="max-w-xs"
                    placeholder="Must be at least 6 characters"
                    {...field}
                    type="password"
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

          <Button type="submit" className="w-full max-w-xs">
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
}
