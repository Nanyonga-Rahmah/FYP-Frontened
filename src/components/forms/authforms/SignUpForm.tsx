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
import { subCounties, USER_ROLES } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  fullName: z.string().min(2, { message: "Field is required" }),
  processingFacilityName: z.string().min(2, { message: "Field is required" }),
  lincenseNumber: z.string().min(2, { message: "Role is required" }),
  location: z.string().min(2, { message: "Field is required" }),

  role: z.string().min(2, { message: "Role is required." }),
  email: z.string().min(2, { message: "Email is required." }).email(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be 10 digits"),
  password: z.string().min(2, { message: "Password is required." }),
  nationalIdNumber: z.string().optional(),
  cooperativeMembershipNumber: z.string().optional(),
});

interface SignUpProps {
  onNext: (data: z.infer<typeof FormSchema>) => void;
}

export function SignUpForm({ onNext }: SignUpProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const rawUserData = localStorage.getItem("UserData");
  const userData = rawUserData ? JSON.parse(rawUserData) : {};

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phone: userData.phone || "",
      password: userData.password || "",
      email: userData.email || "",
      nationalIdNumber: userData.nationalIdNumber || "",
      cooperativeMembershipNumber: userData.cooperativeMembershipNumber || "",
      role: userData.role || "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    localStorage.setItem("UserData", JSON.stringify(data));

    onNext(data);
  }

  const selectedRole = form.watch("role");

  return (
    <ScrollArea className="h-[500px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-3 py-1.5"
        >
          <div className="col-span-2">
            <p className="font-normal text-[#222222] text-sm">Role</p>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="my-2 shadow-none">
                      <SelectValue placeholder="Select your role" />
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

          {selectedRole === "producer" ? (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="col-span-2 text-left">
                    <FormLabel className="text-[#222222]">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="py-2.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-[#222222]">First Name</FormLabel>

                    <FormControl>
                      <Input placeholder="John" {...field} className="py-2.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-[#222222]">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} className="py-2.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2 text-left">
                <FormLabel className="text-[#222222]">Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+256 707444764"
                    {...field}
                    className="py-2.5"
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
                    className="py-2.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRole === "producer" ? (
            <>
              <FormField
                control={form.control}
                name="processingFacilityName"
                render={({ field }) => (
                  <FormItem className="text-left col-span-2">
                    <FormLabel className="text-[#222222]">
                      Processing facility name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="py-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lincenseNumber"
                render={({ field }) => (
                  <FormItem className="text-left col-span-2">
                    <FormLabel className="text-[#222222]">
                      UCDA License Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="py-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <p className="font-normal text-[#222222] text-sm">Location</p>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="my-2 shadow-none">
                          <SelectValue placeholder="Select Sub-County" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <ScrollArea className="h-36">
                            {subCounties.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                             
                            ))}
                             </ScrollArea>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="nationalIdNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2 text-left">
                    <FormLabel className="text-[#222222]">
                      National ID Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CF123456789"
                        {...field}
                        className="py-2.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cooperativeMembershipNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2 text-left">
                    <FormLabel className="text-[#222222]">
                      Cooperative Membership Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="py-2.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

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
                      className="h-12 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                      {...field}
                    />
                    <p onClick={() => setPasswordVisible(!passwordVisible)}>
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
