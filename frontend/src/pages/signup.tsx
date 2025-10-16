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
import { UserPlus2 } from "lucide-react";
import { register } from "@/services/authentication";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name is required." }),
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const res = await register(values.name, values.username, values.password);
      toast[res.type](res.message);
      if (res.success) {
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred during registration.";
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
        <h1 className="text-3xl font-bold">Signup</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rahul Kumar"
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
              <UserPlus2 className="" />
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
            <div className="flex items-center justify-center text-center text-sm">
              <p className="text-muted-foreground">Already have an account? </p>
              <Button variant="link" className="px-1">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default SignupPage;
