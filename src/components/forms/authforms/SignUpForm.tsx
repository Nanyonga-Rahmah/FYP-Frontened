import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { subCounties, USER_ROLES } from "@/lib/constants";

const FormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be 10 digits"),
  email: z.string().min(2, { message: "Email is required." }).email(),
  password: z.string().min(2, { message: "Password is required." }),
  role: z.string().min(2, { message: "Role is required." }),
  cooperativeLocation: z.string().min(2, { message: "Location is required" }),
  nationalIdNumber: z
    .string()
    .min(2, { message: "National ID Number is required" }),
  cooperativeMembershipNumber: z.string().optional(),
  companyName: z.string().optional(),
  facilityName: z.string().optional(),
  licenseNumber: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

interface SignUpProps {
  onNext: (data: FormData) => void;
}

export function SignUpForm({ onNext }: SignUpProps): JSX.Element {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const rawUserData = localStorage.getItem("UserData");
  const userData: Partial<FormData> = rawUserData
    ? JSON.parse(rawUserData)
    : {};

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phone: userData.phone || "",
      password: userData.password || "",
      email: userData.email || "",
      nationalIdNumber: userData.nationalIdNumber || "",
      cooperativeMembershipNumber: userData.cooperativeMembershipNumber || "",
      companyName: userData.companyName || "",
      facilityName: userData.facilityName || "",
      licenseNumber: userData.licenseNumber || "",
      role: userData.role || "",
      cooperativeLocation: userData.cooperativeLocation || "",
    },
    mode: "onChange",
  });

  const handleRoleChange = (value: string): void => {
    setSelectedRole(value);
    form.setValue("role", value);
  };

  function onSubmit(data: FormData): void {
    localStorage.setItem("UserData", JSON.stringify(data));

    onNext(data);
  }

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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleRoleChange(value);
                    }}
                    value={field.value}
                  >
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

          {/* First and Last Name - always required */}
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

          {/* Phone and Email - always required */}
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

          {/* National ID Number - always required */}
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

          {/* Role-specific fields */}
          {selectedRole === "farmer" && (
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
          )}

          {selectedRole === "processor" && (
            <FormField
              control={form.control}
              name="facilityName" 
              render={({ field }) => (
                <FormItem className="text-left col-span-2">
                  <FormLabel className="text-[#222222]">
                    Processing Facility Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="py-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedRole === "exporter" && (
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="text-left col-span-2">
                  <FormLabel className="text-[#222222]">Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="py-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(selectedRole === "processor" || selectedRole === "exporter") && (
            <FormField
              control={form.control}
              name="licenseNumber"
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
          )}

          {/* Location field for all roles */}
          <div className="col-span-2">
            <p className="font-normal text-[#222222] text-sm">Location</p>
            <FormField
              control={form.control}
              name="cooperativeLocation"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
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

          {/* Password field */}
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
                    <div
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="cursor-pointer"
                    >
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
                    </div>
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
