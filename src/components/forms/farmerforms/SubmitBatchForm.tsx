import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, ImageIcon, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { AllHarvests, API_URL } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

const FormSchema = z.object({
  weight: z.string().min(2, {
    message: "Weight is required.",
  }),
  processorId: z.string().min(1, {
    message: "Selecting a processing facility is required",
  }),
  harvestIds: z
    .array(z.string())
    .min(1, { message: "Select at least one harvest" }),
  comments: z.string().optional(),
  documents: z
    .array(
      z
        .any()
        .refine(
          (file) =>
            file instanceof File &&
            (file.type.startsWith("image/") ||
              file.type === "application/pdf" ||
              file.name.endsWith(".zip")),
          {
            message: "File must be an image, PDF, or a zipped file.",
          }
        )
    )
    .optional(),
});

interface Processor {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
}

interface Harvest {
  _id: string;
  coffeeVariety: string[];
  weight: number;
  harvestPeriod: {
    start: string;
    end: string;
  };
  farmerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  farm: {
    _id: string;
    farmName: string;
    location: string;
  };
  status: string;
  createdAt: string;
}

interface SubmitBatchFormProps {
  handleNext: () => void;
  setBatchData: (data: any) => void;
}

type FormData = z.infer<typeof FormSchema>;

export function SubmitBatchForm({
  handleNext,
  setBatchData,
}: SubmitBatchFormProps): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processors, setProcessors] = useState<Processor[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { authToken } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      weight: "",
      comments: "",
      processorId: "",
      documents: [],
      harvestIds: [],
    },
  });

  const selectedHarvestIds = form.watch("harvestIds");

  useEffect(() => {
    if (selectedHarvestIds && selectedHarvestIds.length > 0) {
      const totalWeight = harvests
        .filter((harvest) => selectedHarvestIds.includes(harvest._id))
        .reduce((sum, harvest) => sum + harvest.weight, 0);
      form.setValue("weight", totalWeight.toString(), { shouldValidate: true });
    } else {
      form.setValue("weight", "", { shouldValidate: true });
    }
  }, [selectedHarvestIds, harvests, form]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const processorsResponse = await fetch(
          `${API_URL}user/role/processor`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!processorsResponse.ok) {
          throw new Error("Failed to fetch processors");
        }

        const processorsData = await processorsResponse.json();
        if (processorsData.users && Array.isArray(processorsData.users)) {
          setProcessors(processorsData.users);
        } else {
          console.error("Unexpected processor data format:", processorsData);
          setProcessors([]);
        }

        const harvestsResponse = await fetch(`${AllHarvests}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!harvestsResponse.ok) {
          throw new Error("Failed to fetch harvests");
        }

        const harvestsData = await harvestsResponse.json();
        const filteredHarvests = Array.isArray(harvestsData)
          ? harvestsData.filter((h) => h.status === "approved")
          : harvestsData.harvests
            ? harvestsData.harvests.filter(
                (h: { status: string }) => h.status === "approved"
              )
            : [];
        setHarvests(filteredHarvests);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please refresh and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  function handleFileChange(files: FileList | null): void {
    if (!files) return;
    const fileArray: File[] = Array.from(files);
    setSelectedFiles(fileArray);
    form.setValue("documents", fileArray, { shouldValidate: true });
  }

  async function onSubmit(data: FormData): Promise<void> {
    setIsSubmitting(true);
    console.log("🔵 Starting batch submission...");
    console.log("📝 Form values:", data);

    try {
      const formData = new FormData();
      formData.append("harvestIds", JSON.stringify(data.harvestIds));
      formData.append("processorId", data.processorId);
      formData.append("weight", data.weight);
      if (data.comments) {
        formData.append("comments", data.comments);
      }
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("documents", file);
        });
      }

      for (let [key, value] of formData.entries()) {
        console.log(`FormData entry: ${key} = ${value}`);
      }

      const previewResponse = await fetch(`${API_URL}batches/preview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!previewResponse.ok) {
        const errorData = await previewResponse.json();
        throw new Error(errorData.error || "Failed to generate preview");
      }

      const previewResult = await previewResponse.json();
      if (!previewResult.success) {
        throw new Error(previewResult.error || "Failed to generate preview");
      }

      console.log("📊 Preview result:", previewResult.previewData);

      const finalBatchData = {
        ...data,
        documents: previewResult.previewData.documents || [],
        previewData: previewResult.previewData,
        rawFiles: selectedFiles,
      };

      console.log("📦 Final batch data:", finalBatchData);
      setBatchData(finalBatchData);
      form.reset(); // Clear the form
      setSelectedFiles([]); // Clear selected files
      handleNext();
    } catch (error) {
      console.error("🚨 Error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading data...</span>
      </div>
    );
  }

  if (processors.length === 0 || harvests.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">
          {processors.length === 0 ? (
            "No processing facilities available."
          ) : harvests.length === 0 ? (
            <>
              No approved harvests available to batch.
              <div className="mt-2 text-sm text-gray-600">
                You need to have harvests with 'approved' status before you can
                create a batch.
              </div>
            </>
          ) : (
            ""
          )}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3 px-3 py-1.5"
      >
        <div className="col-span-2">
          <p className="font-normal text-[#222222] text-sm">Harvest Records</p>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="harvestIds"
              render={({ field }) => {
                const selectedHarvests: string[] = field.value || [];

                const toggleHarvest = (id: string): void => {
                  if (selectedHarvests.includes(id)) {
                    field.onChange(selectedHarvests.filter((r) => r !== id));
                  } else {
                    field.onChange([...selectedHarvests, id]);
                  }
                };

                return (
                  <FormItem className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full my-2 shadow-none justify-start"
                        >
                          {selectedHarvests.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedHarvests.map((id) => {
                                const harvest = harvests.find(
                                  (h) => h._id === id
                                );
                                return (
                                  <span
                                    key={id}
                                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                                  >
                                    {harvest
                                      ? `${harvest.coffeeVariety.join(", ")} (${harvest.weight}Bags)`
                                      : id}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            "Select harvest records"
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search records..." />
                          <CommandList>
                            <CommandEmpty>No harvests found</CommandEmpty>
                            <ScrollArea className="h-72">
                              {harvests.map((harvest) => (
                                <CommandItem
                                  key={harvest._id}
                                  onSelect={() => toggleHarvest(harvest._id)}
                                  className="flex justify-between items-center"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {harvest.coffeeVariety.join(", ")}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatDate(harvest.harvestPeriod.start)}{" "}
                                      - {formatDate(harvest.harvestPeriod.end)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Weight: {harvest.weight}Bags | Farm:{" "}
                                      {harvest.farm?.farmName || "N/A"}
                                    </div>
                                  </div>
                                  {selectedHarvests.includes(harvest._id) && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Total Batch weight (Bags)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter weight in Bags"
                  {...field}
                  className="py-2.5"
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <p className="font-normal text-[#222222] text-sm">
            Processing Facility
          </p>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="processorId"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full my-2 shadow-none justify-start"
                        >
                          {field.value ? (
                            <div className="text-black">
                              {(() => {
                                const processor = processors.find(
                                  (p) => p.id === field.value
                                );
                                return processor
                                  ? `${processor.name} (${processor.location})`
                                  : "Select facility";
                              })()}
                            </div>
                          ) : (
                            "Select processing facility"
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search facilities..." />
                          <CommandList>
                            <CommandEmpty>No facilities found</CommandEmpty>
                            <ScrollArea className="h-72">
                              {processors.map((processor) => (
                                <CommandItem
                                  key={processor.id}
                                  onSelect={() => field.onChange(processor.id)}
                                  className="flex justify-between items-center"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {processor.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Location: {processor.location}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Contact: {processor.phone}
                                    </div>
                                  </div>
                                  {field.value === processor.id && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Comments (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  className="text-black"
                  placeholder="Add any additional notes or comments"
                  {...field}
                />
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
                <span className="text-gray-500 text-xs ml-1">
                  (Upload relevant images or PDFs of harvest)
                </span>
              </FormLabel>
              <FormControl>
                <div className="rounded-[6px] border border-dashed h-12 flex justify-center items-center">
                  <label
                    htmlFor="file-upload"
                    className="text-sm flex items-center cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    <span className="text-primary underline">
                      Choose Files
                    </span>{" "}
                    to Upload
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*, application/pdf, .zip"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                </div>
              </FormControl>
              <FormMessage />
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700">
                    Selected files:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
