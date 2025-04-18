import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Stage, Layer, Line } from "react-konva";

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
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  farmName: z.string().min(2, {
    message: "Field is required.",
  }),
 
  numberofTrees: z.string(),
  cultivationMethod: z.string(),
  certification: z.string(),
  documents: z.any(), 
  farmSize: z.string().optional(),
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
   
      farmSize: geoData.area.toString(),
      documents: [],
      numberofTrees: "0",
      certification: "",
      cultivationMethod: "",
      yearOfEstablishment: "",
    },
  });

  console.log(geoData);

  // const stage = new Konva.Stage({
  //   container: 'container',
  //   width: window.innerWidth,
  //   height: window.innerHeight
  // });

  //   const layer = new Konva.Layer();
  // stage.add(layer);

  // const polygon = new Konva.Line({
  //   points: [73, 192, 73, 160, 340, 23, 500, 109, 499, 139, 342, 93],
  //   fill: '#00D2FF',
  //   stroke: 'black',
  //   strokeWidth: 5,
  //   closed: true
  // });

  const toKonvaPoints = (geoCoords: [number, number][]) => {
    return geoCoords.flatMap(([lng, lat]) => [lng * 1000, lat * 1000]);
  };

  const validCoordinates = geoData.coordinates.filter(
    (coord): coord is [number, number] => coord.length === 2
  );
  const points = toKonvaPoints(validCoordinates);

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

      // formData.append(
      //   "farmLocation",
      //   `${geoData.center.lat},${geoData.center.lng}`
      // );

      selectedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      console.log("Sending form data to server...");

      const response = await fetch(FarmCreate, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        toast({
          variant: "success",
          title: "Successful",
          description: `${result.message}`,
        });

        setTimeout(() => {
          navigate("/view-farms");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Failure",
          description: `${result.error}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failure",
        description: `${error.message}`,
      });
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
          <div className="border border-[#DFA32D] px-4 py-2 rounded-[5px] col-span-2 flex gap-4 bg-[#FFF8EA] ">
            <div className="h-[100px]">
              <Stage width={200} height={200}>
                <Layer>
                  <Line
                    points={points}
                    closed
                    fill="#E7B35A"
                    stroke="#A56D00"
                  />
                </Layer>
              </Stage>
            </div>

            <div className="flex flex-col ">
              <div className="flex  items-center">
                <span>Location:</span>
                <span></span>
              </div>
              <div className="flex  items-center">
                <span>Coordinates:</span>[
                {geoData.coordinates
                  .map(([lat, lng]) => `${lat.toFixed(2)}, ${lng.toFixed(2)}`)
                  .join(", ")}
                ]{" "}
              </div>
              <div className="flex  items-center">
                <span>Perimeter:</span>
                <span>{geoData.perimeter}</span>
              </div>
              <div className="flex  items-center">
                <span>Area:</span>
                <span>{geoData.area}</span>
              </div>
            </div>
          </div>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
              className="px-6 text-black/80 grow"
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
