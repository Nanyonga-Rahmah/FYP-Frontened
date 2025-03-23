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
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  email: z.string().min(2, { message: "Field is Required" }).email(),
});

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    navigate("/reset-password");
    setSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-2  space-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="text-[#222222]"> Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@gmail"
                  className=" border-[#DCE1EC] py-2.5 text-black/90 "
                  {...field}
                 
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <Button
            type="submit"
            className="w-full my-2 bg-[#112D3E]"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : " Reset Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
