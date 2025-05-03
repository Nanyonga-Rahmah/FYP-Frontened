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
import { ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { API_URL } from "@/lib/routes";

const KycSchema = z.object({
  nationalIdPhoto: z.instanceof(File, {
    message: "National ID photo is required",
  }),
  passportSizePhoto: z
    .array(z.instanceof(File))
    .min(2, { message: "At least one passport photo is required" }),

});

type KycFormData = z.infer<typeof KycSchema>;

interface SignUpFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  nationalIdNumber: string;
  cooperativeLocation: string;
  cooperativeMembershipNumber?: string;
  companyName?: string;
  facilityName?: string;
  licenseNumber?: string;
}

interface KYCProps {
  handlePrevious: () => void;
  signUpData: Partial<SignUpFormData>;
}

export default function KYCForms({
  handlePrevious,
  signUpData,
}: KYCProps): JSX.Element {
  const [preview, setPreview] = useState<{
    nationalIdPhoto: string | null;
    passportSizePhoto: string | null;
  }>({
    nationalIdPhoto: null,
    passportSizePhoto: null,
  });

  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<KycFormData>({
    resolver: zodResolver(KycSchema),
    defaultValues: {
      nationalIdPhoto: undefined,
      passportSizePhoto: undefined,
    },
  });

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof KycFormData
  ): void {
    const file = event.target.files?.[0];
    if (!file) return;

    form.setValue(fieldName, file);

    setPreview((prev) => ({
      ...prev,
      [fieldName]: URL.createObjectURL(file),
    }));
  }

  const onSubmit = async (values: KycFormData): Promise<void> => {
    const formData = new FormData();

    Object.entries(signUpData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    formData.append("nationalIdPhoto", values.nationalIdPhoto);
    values.passportSizePhoto.forEach((file: File) => {
      formData.append("passportSizePhoto", file);
    });
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          variant: "success",
          title: "Registration Successful",
          description:
            "Your account has been created and is pending verification.",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[500px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* National ID Photo */}
          <FormField
            control={form.control}
            name="nationalIdPhoto"
            render={() => (
              <FormItem>
                <FormLabel className="text-[#222222]">
                  National ID Photo
                </FormLabel>
                <FormControl>
                  <div className="rounded-[6px] border border-dashed h-28 bg-[#C8CFDE] flex justify-center items-center">
                    <label
                      htmlFor="national-id-upload"
                      className="text-sm flex flex-col items-center gap-2 justify-center cursor-pointer"
                    >
                      <ImageIcon />
                      <span className="text-primary">
                        <span className="underline">Choose File</span> to Upload
                      </span>
                    </label>
                    <Input
                      id="national-id-upload"
                      type="file"
                      name="nationalIdPhoto"
                      multiple
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

          {/* Passport Photo */}
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
                      className="text-sm flex flex-col justify-center gap-2 items-center cursor-pointer"
                    >
                      <ImageIcon />
                      <span className="text-primary">
                        <span className="underline">Choose File</span> to Upload
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

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="px-6 text-black/80"
            >
              Back
            </Button>
            <Button type="submit" className="px-6" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
