import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { LogIn } from "lucide-react";
import { login } from "@/services/authentication";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { me } from "@/services/authentication";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const LoginPage = () => {
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const res = await login(values.username, values.password);
      if (res.success) {
        // Get user data and update context
        const userResponse = await me();
        if (userResponse.success && userResponse.data) {
          const userData = {
            _id: userResponse.data._id,
            username: userResponse.data.username,
            createdAt: "",
            updatedAt: "",
          };
          loginUser(userData);
          navigate("/starting-numbers"); // Redirect to dashboard or home page
        }
      }
      toast[res.type](res.message);
    } catch (error) {
      let errorMessage = "An unknown error occurred during login.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <section className="shadow-xl rounded-xl w-full p-6 max-w-md flex flex-col gap-10 border">
        <h1 className="text-3xl font-bold">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="rahul_kumar"
                      disabled={isLoading}
                      {...field}
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
                      type="password"
                      placeholder="••••••"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size={"lg"}
              className="ml-auto"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
              <LogIn className="" />
            </Button>
            <div className="flex items-center justify-center text-center text-sm">
              <p className="text-muted-foreground">Don't have an account? </p>
              <Button variant="link" className="px-1">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default LoginPage;
