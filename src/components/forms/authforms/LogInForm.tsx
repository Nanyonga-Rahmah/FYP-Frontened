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
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Login } from "@/lib/routes";
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  user_email: z.string().min(2, { message: "Field is Required" }).email(),

  password: z.string().min(8, { message: "Field is Required" }),
});

export function LoginForm() {
  const handleClick = () => {
    navigate("/forgot-password");
  };
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(Login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.user_email,
          password: data.password,
        }),
        credentials: "include",
      });

      console.log(response);

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        toast({
          variant: "success",
          title: "Successful",
          description: `${result.message}`,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Failure",
          description: `${result.message}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failure",
        description: `Login  failed. Please try again. || ${error.response?.data?.message}`,
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-2 px-3 gap-3 py-1.5"
      >
        <FormField
          control={form.control}
          name="user_email"
          render={({ field }) => (
            <FormItem className="col-span-2  text-left">
              <FormLabel className="text-[#222222]"> Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@gmail"
                  className=" border-[#DCE1EC] h-10  "
                  disabled={submitting}
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
            <FormItem className="  space-y-1 col-span-2 text-left">
              <FormLabel className="font-medium text-sm text-[#222222]">
                Password
              </FormLabel>
              <FormControl>
                <div className="flex border border-input h-10 justify-between items-center pr-4 rounded-md overflow-hidden">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 border-none focus-visible:ring-0  focus-visible:ring-offset-0 shadow-none  "
                    {...field}
                    disabled={submitting}
                  />
                  <p onClick={togglePassword}>
                    {passwordVisible ? (
                      <EyeIcon
                        className="w-[14px]"
                        color="rgba(88, 89, 98, 1)"
                      />
                    ) : (
                      <EyeOffIcon
                        className="w-[14px]"
                        color="rgba(88, 89, 98, 1)"
                      />
                    )}
                  </p>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <span
          className="text-[#112D3E] flex justify-end text-sm  col-span-2 cursor-pointer"
          onClick={handleClick}
        >
          Forgot password?
        </span>
        <div className="col-span-2">
          <Button
            type="submit"
            className="w-full my-2 bg-[#112D3E]"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : " Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
