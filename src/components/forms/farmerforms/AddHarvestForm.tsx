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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  farm: z.string().min(1, { message: "Farm is required." }),
  coffeeVariety: z
    .array(z.string())
    .min(1, { message: "Select at least one variety" }),
  weight: z.string().min(1, { message: "Number of bags is required." }),
  plantingPeriod: z
    .object({
      start: z.string().min(1, { message: "Planting start date required." }),
      end: z.string().min(1, { message: "Planting end date required." }),
    })
    .refine(
      (data) =>
        !data.start || !data.end || new Date(data.start) <= new Date(data.end),
      { message: "Planting end date must be after start date.", path: ["end"] }
    ),
  harvestingPeriod: z
    .object({
      start: z.string().min(1, { message: "Harvesting start date required." }),
      end: z.string().min(1, { message: "Harvesting end date required." }),
    })
    .refine(
      (data) =>
        !data.start || !data.end || new Date(data.start) <= new Date(data.end),
      {
        message: "Harvesting end date must be after start date.",
        path: ["end"],
      }
    ),
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

export function AddHarvestForm() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [farms, setFarms] = useState<{ _id: string; farmName: string }[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
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
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farm: "",
      coffeeVariety: [],
      weight: "",
      plantingPeriod: { start: "", end: "" },
      harvestingPeriod: { start: "", end: "" },
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
        start: data.plantingPeriod.start,
        end: data.plantingPeriod.end,
      },
      harvestPeriod: {
        start: data.harvestingPeriod.start,
        end: data.harvestingPeriod.end,
      },
      cultivationMethods: data.cultivationMethod,
    };
    const formData = new FormData();

    formData.append("data", JSON.stringify(harvestData));

    selectedFiles.forEach((file) => formData.append("documents", file));

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(HarvestCreate, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        console.log("API error response:", errData);
        throw new Error(errData.error || "Failed to save harvest");
      }

      const result = await response.json();
      toast({
        variant: "default",
        title: "Success",
        description: `${result.message}`,
      });

      console.log("Saved harvest:", result);
      navigate("/view-harvests");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save harvest",
      });
    }
  }

  return (
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
                      placeholder={loadingFarms ? "Loading..." : "Select farm"}
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
            const selectedVarieties: string[] = field.value || [];

            const toggleVariety = (variety: string) => {
              if (selectedVarieties.includes(variety)) {
                field.onChange(selectedVarieties.filter((v) => v !== variety));
              } else {
                field.onChange([...selectedVarieties, variety]);
              }
            };

            return (
              <FormItem className="col-span-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Coffee Variety
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedVarieties.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedVarieties.map((v) => (
                            <span
                              key={v}
                              className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <span>Select Varieties</span>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search varieties..." />
                      <CommandList>
                        {coffeeVarieties.map((v, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => toggleVariety(v)}
                          >
                            {v}
                            {selectedVarieties.includes(v) && (
                              <span className="ml-auto text-green-600">
                                Selected
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
          name="plantingPeriod.start"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Planting Start
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
          name="plantingPeriod.end"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Planting End
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
          name="harvestingPeriod.start"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Harvesting Start
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
          name="harvestingPeriod.end"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Harvesting End
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
            const selectedMethods: string[] = field.value || [];

            const toggleMethod = (method: string) => {
              if (selectedMethods.includes(method)) {
                field.onChange(selectedMethods.filter((m) => m !== method));
              } else {
                field.onChange([...selectedMethods, method]);
              }
            };

            return (
              <FormItem className="col-span-2">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Farming methods
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedMethods.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedMethods.map((method) => (
                            <span
                              key={method}
                              className="bg-blue-100 text-[#222222] px-2 py-1 rounded-md text-xs"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <span>Select Method</span>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search methods..." />
                      <CommandList>
                        {cultivationMethods.map((method, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => toggleMethod(method)}
                          >
                            {method}
                            {selectedMethods.includes(method) && (
                              <span className="text-green-600">Selected</span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                    <span className="text-primary underline">Choose Files</span>{" "}
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

        <Button type="submit" className="col-span-2 py-2 mt-2">
          Save Harvest
        </Button>
      </form>
    </Form>
  );
}
