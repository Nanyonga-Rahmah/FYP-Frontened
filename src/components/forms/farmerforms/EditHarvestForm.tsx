import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useState } from "react";


const FormSchema = z.object({
  farmName: z.string().min(2, {
    message: "Field is required.",
  }),
  farmLocation: z.string().min(2, {
    message: "Field is required.",
  }),
  latitude: z.string(),
  longitude: z.string(),
  cultivationMethod: z.string(),
  certification: z.string(),
  variety: z.string(),
  weight: z.string(),
  harvestDate: z.string(),

  documents: z.array(
    z
      .any()
      .refine(
        (file) =>
          file instanceof File &&
          (file.type.startsWith("image/") || file.name.endsWith(".zip")),
        {
          message: "File must be an image or a zipped file.",
        }
      )
  ),

  farmSize: z.string().min(2, {
    message: "Field is required.",
  }),
});

export function EditHarvestForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [cultivationMethods] = useState([
    "Organic",
    "Convetional",
    "Agroforestry",
  ]);

  const [certifications] = useState([
    "Organic",
    "Fairtrade",
    "Rainforest Alliance",
  ]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farmName: "",
      farmLocation: "",
      farmSize: "",
      documents: [],
      longitude: "",
      certification: "",
      cultivationMethod: "",
      latitude: "",
      variety: "",
      weight: "",
      harvestDate: "",
    },
  });
  function handleFileChange(files: FileList | null) {
    if (!files) return;
    const fileArray: File[] = Array.from(files);
    setSelectedFiles(fileArray);
    form.setValue("documents", fileArray, { shouldValidate: true });
  }
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    console.log(selectedFiles);

  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2 px-3 py-1.5"
      >
        <FormField
          control={form.control}
          name="variety"
          render={({ field }) => (
            <FormItem className="col-span-1 ">
              <FormLabel className="font-normal text-[#222222] text-sm">Coffee Variety</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  {" "}
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {cultivationMethods.map((method, index) => {
                      return (
                        <SelectItem key={index} value={method}>
                          {method}
                        </SelectItem>
                      );
                    })}
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
            <FormItem className="col-span-1 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">Weight</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter weight in kg"
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
          name="harvestDate"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">Harvest Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-9" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="farmName"
          render={({ field }) => (
            <FormItem className="col-span-1 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">Farm name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  {" "}
                  <SelectTrigger>
                    <SelectValue placeholder="Select farm" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {cultivationMethods.map((method, index) => {
                      return (
                        <SelectItem key={index} value={method}>
                          {method}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="farmSize"
          render={({ field }) => (
            <FormItem className="col-span-1 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">Farm size</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter farm size in hectares"
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
          name="cultivationMethod"
          render={({ field }) => (
            <FormItem className="col-span-2 space-y-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Cultivation methods</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  {" "}
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {cultivationMethods.map((method, index) => {
                      return (
                        <SelectItem key={index} value={method}>
                          {method}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certification"
          render={({ field }) => (
            <FormItem className="col-span-2 space-y-1">
              <FormLabel className="font-normal text-[#222222] text-sm">Certification</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  {" "}
                  <SelectTrigger>
                    <SelectValue placeholder="Select certifications" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {certifications.map((certificate, index) => {
                      return (
                        <SelectItem key={index} value={certificate}>
                          {certificate}
                        </SelectItem>
                      );
                    })}
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
              <FormLabel className="font-normal text-[#222222] text-sm">
                Documents
                <span> (Upload relevant images of harvest)</span>
              </FormLabel>
              <FormControl>
                <div className=" rounded-[6px] border border-dashed h-10 flex justify-center items-center">
                  <label htmlFor="file-upload" className="text-sm">
                    <span className="text-primary underline">Choose Files</span>{" "}
                    to Upload
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*, .zip"
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
          Update Harvest
        </Button>
      </form>
    </Form>
  );
}
