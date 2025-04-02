import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { useState } from "react";
import { FarmCreate } from "@/lib/routes";

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

  yearOfEstablishment: z.string().min(2, {
    message: "Field is required.",
  }),
});

export function AddFarmForm() {
  const navigate = useNavigate();
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
      yearOfEstablishment: "",
    },
  });
  function handleFileChange(files: FileList | null) {
    if (!files) return;
    const fileArray: File[] = Array.from(files);
    setSelectedFiles(fileArray);
    form.setValue("documents", fileArray, { shouldValidate: true });
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("farmName", data.farmName);
      formData.append("location", data.farmLocation);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("farmSize", data.farmSize);
      formData.append("cultivationMethods", data.cultivationMethod);
      formData.append("certifications", data.certification);
      formData.append("yearEstablished", data.yearOfEstablishment);

      // Append files
      selectedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      // Send request to backend
      const response = await fetch(FarmCreate, {
        method: "POST",
        body: formData,
        credentials: "include", 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create farm");
      }

      const result = await response.json();
      console.log("Farm created successfully", result);

      navigate("/view-farms");
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }

  return (
    <ScrollArea className="h-[65vh]  ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-2 px-3 py-1.5"
        >
          <FormField
            control={form.control}
            name="farmName"
            render={({ field }) => (
              <FormItem className="col-span-2 text-left">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Farm name
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="py-2.5" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="farmLocation"
            render={({ field }) => (
              <FormItem className="col-span-2 text-left">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Farm location
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} className="py-2.5" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem className="col-span-1 text-left">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Latitude
                  <span>(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="py-2.5" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem className="col-span-1 text-left">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Longitude
                  <span>(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="py-2.5" />
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
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Farm size
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="py-2.5" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearOfEstablishment"
            render={({ field }) => (
              <FormItem className="col-span-1 text-left">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Year of Establishment
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    className="py-2.5"
                    type="date"
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
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Cultivation methods
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    {" "}
                    <SelectTrigger>
                      <SelectValue />
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
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Certification
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    {" "}
                    <SelectTrigger>
                      <SelectValue />
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
                  <span>
                    {" "}
                    (Upload relevant certification or farm documents)
                  </span>
                </FormLabel>
                <FormControl>
                  <div className=" rounded-[6px] border border-dashed h-10 flex justify-center items-center">
                    <label htmlFor="file-upload" className="text-sm">
                      <span className="text-primary underline">
                        Choose Files
                      </span>{" "}
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
            Save farm
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
