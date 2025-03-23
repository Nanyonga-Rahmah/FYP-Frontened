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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { USER_ROLES } from "@/lib/constants";

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Field is required.",
  }),

  role: z.string().min(2, {
    message: "Field is required.",
  }),
  lastName: z.string().min(2, {
    message: "Field is required.",
  }),
  email: z
    .string()
    .min(2, {
      message: "Field is required.",
    })
    .email(),

  phoneNumber: z.string().min(2, {
    message: "Field is required.",
  }),

  password: z.string().min(2, {
    message: "Field is required.",
  }),
});

export function SignUpForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      email: "",
      role: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3 px-3 py-1.5"
      >
        <div className="col-span-2">
          <p className="font-normal text-[#222222] text-sm">Role</p>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className=" my-2 shadow-none  ">
                      <SelectValue
                        placeholder="Select your role "
                        className=" "
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {USER_ROLES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category.toLowerCase()}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="col-span-1 text-left">
              <FormLabel className="text-[#222222]">First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field}  className="py-2.5 " />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="col-span-1 text-left">
              <FormLabel className="text-[#222222]">Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} className="py-2.5 " />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="text-[#222222]">Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="+256 707444764"
                  {...field}
                  className="py-2.5 "
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="text-[#222222]">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="abc@example.com"
                  {...field}
                  className="py-2.5 "
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
            <FormItem className="col-span-2 text-left">
              <FormLabel className="text-[#222222]">Password</FormLabel>
              <FormControl>
                <div className="flex border border-input h-10 justify-between items-center pr-4 rounded-md overflow-hidden">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    className="h-12 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none  "
                    {...field}
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
        <Button type="submit" className="col-span-2 py-2 mt-2">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
