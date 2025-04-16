import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, ImageIcon } from "lucide-react";
import { cooperatives } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Register } from "@/lib/routes";

import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Define the schema for KYC data
const formSchema = z.object({
  nationalIdPhoto: z.instanceof(File, {
    message: "National ID photo is required",
  }),
  passportSizePhoto: z.instanceof(File, {
    message: "Passport photo is required",
  }),
  cooperativeLocation: z
    .string()
    .min(1, { message: "Cooperative location is required" }),
});

interface KYCProps {
  handlePrevious: () => void;
  signUpData: z.infer<typeof SignUpFormSchema>;
}

const SignUpFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string(),
  nationalIdNumber: z.string().optional(),
  cooperativeMembershipNumber: z.string().optional(),
});

export default function KYCForms({ handlePrevious, signUpData }: KYCProps) {
  const [preview, setPreview] = useState<{
    nationalIdPhoto: string | null;
    passportSizePhoto: string | null;
  }>({ nationalIdPhoto: null, passportSizePhoto: null });
  const [open, setOpen] = useState(false);
  const [selectedCooperative, setSelectedCooperative] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationalIdPhoto: undefined,
      passportSizePhoto: undefined,
      cooperativeLocation: "",
    },
  });

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof z.infer<typeof formSchema>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    form.setValue(fieldName, file);
    setPreview((prev) => ({
      ...prev,
      [fieldName]: URL.createObjectURL(file),
    }));
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("firstName", signUpData.firstName);
    formData.append("lastName", signUpData.lastName);
    formData.append("email", signUpData.email);
    formData.append("phone", signUpData.phone);
    formData.append("password", signUpData.password);
    formData.append("role", signUpData.role);
    formData.append(
      "cooperativeMembershipNumber",
      signUpData.cooperativeMembershipNumber || ""
    );
    formData.append("nationalIdNumber", signUpData.nationalIdNumber || "");

    formData.append("cooperativeLocation", values.cooperativeLocation);
    formData.append("nationalIdPhoto", values.nationalIdPhoto);
    formData.append("passportSizePhoto", values.passportSizePhoto);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(Register, {
        method: "POST",
        body: formData,
      });

      console.log("---->", response);

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Successful",
          description: `${data.message}`,
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Failure",
          description: `${data.message}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failure",
        description: `Registration failed. Please try again. || ${error.response?.data?.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[500px] ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <FormField
            control={form.control}
            name="nationalIdPhoto"
            render={() => (
              <FormItem>
                <FormLabel className="text-[#222222]">ID Photo</FormLabel>
                <FormControl>
                  <div className="rounded-[6px] border border-dashed h-28 bg-[#C8CFDE] flex justify-center items-center">
                    <label
                      htmlFor="national-id-upload"
                      className="text-sm flex flex-col items-center gap-2 justify-center"
                    >
                      <ImageIcon />
                      <span className="text-primary">
                        <span className="underline">Choose File </span> to
                        Upload
                      </span>
                    </label>
                    <Input
                      id="national-id-upload"
                      type="file"
                      name="nationalIdPhoto"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "nationalIdPhoto")}
                      className="hidden"
                    />
                  </div>
                </FormControl>
                <FormMessage />
                {preview.nationalIdPhoto && (
                  <img
                    src={preview.nationalIdPhoto}
                    alt="ID Photo"
                    className="w-20 h-20 object-cover rounded mt-2"
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passportSizePhoto"
            render={() => (
              <FormItem>
                <FormLabel className="text-[#222222]">
                  Passport-size Photo
                </FormLabel>
                <FormControl>
                  <div className="rounded-[6px] border border-dashed h-28 bg-[#C8CFDE] flex justify-center items-center">
                    <label
                      htmlFor="passport-upload"
                      className="text-sm flex flex-col justify-center gap-2 items-center"
                    >
                      <ImageIcon />
                      <span className="text-primary">
                        <span className="underline">Choose File </span> to
                        Upload
                      </span>
                    </label>
                    <Input
                      id="passport-upload"
                      type="file"
                      accept="image/*"
                      name="passportSizePhoto"
                      onChange={(e) =>
                        handleImageChange(e, "passportSizePhoto")
                      }
                      className="hidden"
                    />
                  </div>
                </FormControl>
                <FormMessage />
                {preview.passportSizePhoto && (
                  <img
                    src={preview.passportSizePhoto}
                    alt="Passport"
                    className="w-20 h-20 mt-2 object-cover rounded"
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cooperativeLocation"
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-col text-left">
                <FormLabel className="text-[#222222]">
                  Cooperative/Location
                </FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between text-black/90 outline-none  focus:ring-0"
                      >
                        {selectedCooperative
                          ? cooperatives.find(
                              (cooperative) =>
                                cooperative.value === selectedCooperative
                            )?.label
                          : "Select cooperative..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Select Cooperative/Sub-County"
                          className="h-10 text-[#222222]"
                        />
                        <CommandList>
                          <CommandEmpty className="text-[#222222]">
                            No cooperative found.
                          </CommandEmpty>
                          <CommandGroup>
                            {cooperatives.map((cooperative) => (
                              <CommandItem
                                key={cooperative.value}
                                value={cooperative.value}
                                onSelect={() => {
                                  setSelectedCooperative(cooperative.value);
                                  field.onChange(cooperative.value);
                                  setOpen(false);
                                }}
                              >
                                {cooperative.label}
                                <Check
                                  className={
                                    selectedCooperative === cooperative.value
                                      ? "opacity-100 ml-auto"
                                      : "opacity-0 ml-auto"
                                  }
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center gap-56">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="px-6 text-black/80"
            >
              Back
            </Button>
            <Button type="submit" className="grow" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
