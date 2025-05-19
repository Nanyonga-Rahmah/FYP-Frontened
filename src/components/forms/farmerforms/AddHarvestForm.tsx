import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { fetchMyFarms } from "@/lib/farm";
import { HarvestCreate } from "@/lib/routes";

import useAuth from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import MultiSelect from "@/components/Farmers/MultiSelect";

const FormSchema = z.object({
  farm: z.string().min(1, { message: "Farm is required." }),
  coffeeVariety: z
    .array(z.string())
    .min(1, { message: "Select at least one variety" }),
  weight: z
    .string()
    .min(1, { message: "Number of bags is required." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Enter a valid number of bags.",
    }),
  plantingPeriodStart: z.string().min(1, { message: "Start date required." }),
  plantingPeriodEnd: z.string().min(1, { message: "End date required." }),
  harvestingPeriodStart: z.string().min(1, { message: "Start date required." }),
  harvestingPeriodEnd: z.string().min(1, { message: "End date required." }),
  cultivationMethod: z
    .array(z.string())
    .min(1, { message: "Select at least one method" }),
  documents: z.array(
    z
      .any()
      .refine(
        (file) => file instanceof File && file.type.startsWith("image/"),
        { message: "File must be an image." }
      )
  ),
});


interface AddHarvestFormProps {
  onClose:() => void;
}

export function AddHarvestForm({onClose}: AddHarvestFormProps) {
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [farms, setFarms] = useState<{ _id: string; farmName: string }[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cultivationMethods = [
    "Weeding",
    "Mulching",
    "Fertilizer Application",
    "Pest Control",
    "Shade Management",
  ];
  const coffeeVarieties = ["Robusta", "Arabica"];

  


  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      fetchMyFarms(authToken)
        .then(setFarms)
        .catch((err) => console.error("Failed to load farms:", err))
        .finally(() => setLoadingFarms(false));
    } else {
      console.error("Auth token is null. Cannot fetch farms.");
      setLoadingFarms(false);
    }
  }, [authToken]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farm: "",
      coffeeVariety: [],
      weight: "",
      plantingPeriodStart: "",
      plantingPeriodEnd: "",
      harvestingPeriodStart: "",
      harvestingPeriodEnd: "",
      cultivationMethod: [],
      documents: [],
    },
  });

  function handleFileChange(files: FileList | null) {
    if (!files) return;
    const fileArray: File[] = Array.from(files);
    setSelectedFiles(fileArray);
    form.setValue("documents", fileArray, { shouldValidate: true });
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const harvestData = {
      farmId: data.farm,
      coffeeVariety: data.coffeeVariety,
      weight: data.weight,
      plantingPeriod: {
        start: data.plantingPeriodStart,
        end: data.plantingPeriodEnd,
      },
      harvestPeriod: {
        start: data.harvestingPeriodStart,
        end: data.harvestingPeriodEnd,
      },
      cultivationMethods: data.cultivationMethod,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(harvestData));

    selectedFiles.forEach((file) => formData.append("documents", file));

    console.log("Form data to be submitted:", formData);

    try {
      setIsSubmitting(true);
      const response = await fetch(HarvestCreate, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save harvest");
      }

      toast({
        variant: "success",
        title: "Success",
        description: "Successfully Added Harvest",
      });
      form.reset();
      setSelectedFiles([]);
      onClose();

      navigate("/view-harvests");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        variant: "destructive",
        title: "Failure",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[500px] w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-2 px-3 py-1.5"
        >
          <FormField
            control={form.control}
            name="farm"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Farm
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingFarms}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingFarms ? "Loading..." : "Select farm"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {farms.map((f) => (
                        <SelectItem key={f._id} value={f._id}>
                          {f.farmName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coffeeVariety"
            render={({ field }) => {
              const handleCoffeeVarietiesChange = (values: string[]) => {
                field.onChange(values);
              };

              return (
                <FormItem className="col-span-1">
                  <MultiSelect
                    label="Coffee Variety"
                    options={coffeeVarieties}
                    selectedValues={field.value || []}
                    onChange={handleCoffeeVarietiesChange}
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Number of bags
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter number of bags"
                    {...field}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plantingPeriodStart"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Planting period start
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plantingPeriodEnd"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Planting period end
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harvestingPeriodStart"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Harvesting Period start
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harvestingPeriodEnd"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Harvesting Period end
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cultivationMethod"
            render={({ field }) => {
              const handleFarmingMethodsChange = (values: string[]) => {
                field.onChange(values);
              };
              return (
                <FormItem className="col-span-2">
                  <MultiSelect
                    label="Farming methods"
                    options={cultivationMethods}
                    selectedValues={field.value || []}
                    onChange={handleFarmingMethodsChange}
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="documents"
            render={() => (
              <FormItem className="col-span-2">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Images of harvest
                </FormLabel>
                <FormControl>
                  <div className="rounded-[6px] border border-dashed h-20 flex justify-center items-center">
                    <label htmlFor="file-upload" className="text-sm">
                      <span className="text-primary underline">
                        Choose Files
                      </span>{" "}
                      to upload
                    </label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Accepted formats: JPG, PNG. Max size: 5MB
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="col-span-2 py-2 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting" : "Save Harvest"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
