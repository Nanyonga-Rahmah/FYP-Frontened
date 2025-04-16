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
import { useEffect, useState } from "react";
import { USER_ROLES } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {LOCATION_OPTIONS} from "@/lib/constants";


// Schema definition
const FormSchema = z.object({
    fullName: z
        .string()
        .min(2, { message: "Full name is required." })
        .regex(/^[a-zA-Z\s'-]+$/, {
            message: "Full name can only contain letters, spaces, apostrophes, and hyphens.",
        }),
    role: z.string().min(2, { message: "Role is required." }),
    email: z.string().min(2, { message: "Email is required." }).email(),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be 10 digits"),
    password: z.string().min(2, { message: "Password is required." }),
    maaifEmpId: z.string().min(2, { message: "MAAIF Id Number is required." }),
    location: z.string().nonempty({ message: "Location is required." }),
});

interface SignUpProps {
    onNext: (data: z.infer<typeof FormSchema>) => void;
}

export function ExporterSignUpForm({ onNext }: SignUpProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [locationOptions, setLocationOptions] = useState<{ label: string; value: string }[]>([]);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            password: "",
            email: "",
            phone: "",
            maaifEmpId: "",
            location: "",
            role: "",
        },
    });

    useEffect(() => {
        async function fetchLocations() {
            try {
                const res = await fetch("https://api.opendataug.org/v1/subcounties", {
                    headers: {
                        "x-api-key": "opu_fd83f92600ad40f2b7b74eefdb51cef8MRNEVCrx",
                    },
                });
                const data = await res.json();
                const locations = data.data.map((loc: any) => ({
                    label: `${loc.name}, ${loc.district_name}`,
                    value: `${loc.name.toLowerCase().replace(/\s+/g, "_")}_${loc.district_name.toLowerCase().replace(/\s+/g, "_")}`,
                }));
                setLocationOptions(locations);
            } catch (err) {
                console.error("Failed to load locations:", err);
            }
        }
        fetchLocations();
    }, []);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        onNext(data);
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

                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem className="text-left">
                                <FormLabel className="text-[#222222]">Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} className="py-2.5" />
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
                        name="maaifEmpId"
                        render={({ field }) => (
                            <FormItem className="col-span-2 text-left">
                                <FormLabel className="text-[#222222]">
                                    MAAIF Employee ID Number
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
                        name="location"
                        render={({ field }) => (
                            <FormItem className="col-span-2 text-left">
                                <FormLabel className="text-[#222222]">Location</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="my-2 shadow-none">
                                        <SelectValue placeholder="Select your location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {LOCATION_OPTIONS.map((loc) => (
                                                <SelectItem key={loc.value} value={loc.value}>
                                                    {loc.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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
