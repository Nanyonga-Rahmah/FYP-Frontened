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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { fetchMyFarms } from "@/lib/farm";
import { HarvestCreate } from "@/lib/routes";

const FormSchema = z.object({
  farm: z.string().min(1, { message: "Farm is required." }),
  coffeeVariety: z.string().min(1, { message: "Variety is required." }),
  weight: z.string().min(1, { message: "Number of bags is required." }),
  plantingStart: z.string().min(1, { message: "Start date required." }),
  plantingEnd: z.string().min(1, { message: "End date required." }),
  harvestStart: z.string().min(1, { message: "Start date required." }),
  harvestEnd: z.string().min(1, { message: "End date required." }),
  cultivationMethod: z.string().min(1, { message: "Method is required." }),
  documents: z.array(z.any().refine(
    (file) => file instanceof File && file.type.startsWith("image/"),
    { message: "File must be an image." }
  )),
});

export function AddHarvestForm() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [farms, setFarms] = useState<{ _id: string; farmName: string }[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const cultivationMethods = ["Organic", "Conventional", "Agroforestry"];
  const coffeeVarieties = ["Robusta", "Arabica"];

  useEffect(() => {
    fetchMyFarms()
      .then(setFarms)
      .catch((err) => console.error("Failed to load farms:", err))
      .finally(() => setLoadingFarms(false));
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farm: "",
      coffeeVariety: "",
      weight: "",
      plantingStart: "",
      plantingEnd: "",
      harvestStart: "",
      harvestEnd: "",
      cultivationMethod: "",
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
    // Create structured data object 
    const harvestData = {
      farmId: data.farm,
      coffeeVariety: data.coffeeVariety,
      weight: data.weight,
      plantingPeriod: {
        start: data.plantingStart,
        end: data.plantingEnd
      },
      harvestPeriod: {
        start: data.harvestStart,
        end: data.harvestEnd
      },
      cultivationMethods: [data.cultivationMethod]
    };
  
    // Create FormData for sending the files
    const formData = new FormData();
    
    // Append JSON data as a string
    formData.append('data', JSON.stringify(harvestData));
    
    // Append files
    selectedFiles.forEach((file) => formData.append("documents", file));
  
    try {
      const response = await fetch(HarvestCreate, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
  
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save harvest");
      }
  
      const result = await response.json();
      console.log("Saved harvest:", result);
      navigate("/view-harvests");
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.message);
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
      <FormLabel className="font-normal text-[#222222] text-sm">Farm</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value} disabled={loadingFarms}>
          <SelectTrigger>
            <SelectValue placeholder={loadingFarms ? "Loading..." : "Select farm"} />
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
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Coffee Variety</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeVarieties.map((v, index) => (
                      <SelectItem key={index} value={v}>{v}</SelectItem>
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
          name="weight"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Number of bags</FormLabel>
              <FormControl>
                <Input placeholder="Enter number of bags" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plantingStart"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Planting start</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plantingEnd"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Planting end</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harvestStart"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Harvest start</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harvestEnd"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Harvest end</FormLabel>
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
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="font-normal text-[#222222] text-sm">Farming methods</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultivationMethods.map((method, index) => (
                      <SelectItem key={index} value={method}>{method}</SelectItem>
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
          name="documents"
          render={() => (
            <FormItem className="col-span-2">
              <FormLabel className="font-normal text-[#222222] text-sm">Images of harvest</FormLabel>
              <FormControl>
                <div className="rounded-[6px] border border-dashed h-20 flex justify-center items-center">
                  <label htmlFor="file-upload" className="text-sm">
                    <span className="text-primary underline">Choose Files</span> to upload
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
