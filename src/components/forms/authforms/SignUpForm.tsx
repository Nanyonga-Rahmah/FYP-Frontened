import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

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
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Field is required.",
  }),

  role: z.string().min(2, {
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
  notInGroup: z.boolean().optional(),

  nin: z.string().min(2, {
    message: "Field is required.",
  }),

  membershipNumber: z.string().min(2, {
    message: "Field is required.",
  }),
});

interface SignUpProps {
  handleNext: () => void;
}

export function SignUpForm({ handleNext }: SignUpProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      password: "",
      email: "",
      nin: "",
      membershipNumber: "",
      role: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    handleNext();
  }

  return (
    <ScrollArea className="h-[500px]">
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
            name="fullName"
            render={({ field }) => (
              <FormItem className="col-span-2 text-left">
                <FormLabel className="text-[#222222]">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="py-2.5 " />
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
            name="nin"
            render={({ field }) => (
              <FormItem className="col-span-2 text-left">
                <FormLabel className="text-[#222222]">
                  National ID Number (Or use Voter ID if no NIN)
                </FormLabel>
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
            name="membershipNumber"
            render={({ field }) => (
              <FormItem className="col-span-2 text-left">
                <FormLabel className="text-[#222222]">
                  Cooperative Membership Number
                </FormLabel>
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
          <div className="items-top flex space-x-2">
            <Checkbox id="notInGroup" className="h-4 w-4" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Not in group
              </label>
            </div>
          </div>

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
            Next
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
