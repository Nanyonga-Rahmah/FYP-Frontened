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

// Modified schema to better handle file uploads
const FormSchema = z.object({
  farmName: z.string().min(2, {
    message: "Field is required.",
  }),
  farmLocation: z.string().optional(), // Made optional since it's derived from geoData
  numberofTrees: z.string(),
  cultivationMethod: z.string(),
  certification: z.string(),
  documents: z.any(), // Simplified to avoid validation issues
  farmSize: z.string().optional(), // Made optional since it's derived from geoData
  yearOfEstablishment: z.string().min(2, {
    message: "Field is required.",
  }),
});

interface AddFarmProps {
  handlePrevious: () => void;
  geoData: {
    polygon: any;
    area: number;
    perimeter: number;
    coordinates: number[][];
    center: { lat: number; lng: number };
  };
}

export function AddFarmForm({ handlePrevious, geoData }: AddFarmProps) {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      farmSize: geoData.area.toString(), // Pre-fill with area from geoData
      documents: [],
      numberofTrees: "0",
      certification: "",
      cultivationMethod: "",
      yearOfEstablishment: "",
    },
  });

  function handleFileChange(files: FileList | null) {
    if (!files) return;
    const fileArray: File[] = Array.from(files);
    setSelectedFiles(fileArray);
    form.setValue("documents", fileArray);
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form submission started with data:", data);

    if (isSubmitting) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append("farmName", data.farmName);
      formData.append("numberofTrees", data.numberofTrees);
      formData.append("cultivationMethods", data.cultivationMethod);
      formData.append("certifications", data.certification);
      formData.append("yearEstablished", data.yearOfEstablishment);

      // Add geo data
      formData.append("latitude", geoData.center.lat.toString());
      formData.append("longitude", geoData.center.lng.toString());
      formData.append("polygon", JSON.stringify(geoData.polygon));
      formData.append("area", geoData.area.toString());
      formData.append("perimeter", geoData.perimeter.toString());

      // Add location derived from geoData
      formData.append(
        "farmLocation",
        `${geoData.center.lat},${geoData.center.lng}`
      );

      // Add files
    selectedFiles.forEach((file) => {
      formData.append("documents", file);
    });

      console.log("Sending form data to server...");

      const response = await fetch(FarmCreate, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Server response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create farm");
      }

      const result = await response.json();
      console.log("Farm created successfully", result);
      navigate("/view-farms");
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      alert(`Failed to submit form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[65vh]">
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
                  <Input
                    placeholder="Enter farm name"
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
            name="numberofTrees"
            render={({ field }) => (
              <FormItem className="col-span-1 text-left">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Total coffee trees on farm
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Number of trees"
                    {...field}
                    className="py-2.5"
                    type="number"
                  />
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
                  Year farm started
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cultivation method" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {cultivationMethods.map((method, index) => (
                        <SelectItem key={index} value={method}>
                          {method}
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
            name="certification"
            render={({ field }) => (
              <FormItem className="col-span-2 space-y-1">
                <FormLabel className="font-normal text-[#222222] text-sm">
                  Certification
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certification" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {certifications.map((certificate, index) => (
                        <SelectItem key={index} value={certificate}>
                          {certificate}
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
                  <div className="rounded-[6px] border border-dashed h-10 flex justify-center items-center">
                    <label
                      htmlFor="file-upload"
                      className="text-sm cursor-pointer w-full h-full flex items-center justify-center"
                    >
                      <span className="text-primary underline">
                        Choose Files
                      </span>{" "}
                      to Upload{" "}
                      {selectedFiles.length > 0 &&
                        `(${selectedFiles.length} selected)`}
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

          <div className="col-span-2 flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="px-6 text-black/80"
            >
              Back
            </Button>
            <Button type="submit" className="grow ml-4" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
