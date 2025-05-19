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
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";

const FormSchema = z.object({
  totalOutputWeight: z.string().min(1, {
    message: "Total weight is required.",
  }),
  exporterFacility: z.string().min(1, {
    message: "Selecting an exporter facility is required",
  }),
  batchIds: z
    .array(z.string())
    .min(1, { message: "Select at least one batch" }),
  comments: z.string().optional(),
});

interface Exporter {
  id: string;
  companyName: string;
  location: string;
  email: string;
}

interface Batch {
  recievedWeight: number;
  id: string;
  totalWeight: number;
  status: string;
}

interface SubmitLotFormProps {
  handleNext: () => void;
  setLotData: (data: any) => void;
}

export function SubmitLotForm({
  handleNext,
  setLotData,
}: SubmitLotFormProps): JSX.Element {
  const [exporters, setExporters] = useState<Exporter[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { authToken } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      totalOutputWeight: "",
      exporterFacility: "",
      batchIds: [],
      comments: "",
    },
  });

  const selectedBatchIds = form.watch("batchIds");

  // Auto-calculate total weight based on selected batches
  useEffect(() => {
    if (selectedBatchIds.length > 0) {
      const totalWeight = batches
        .filter((batch) => selectedBatchIds.includes(batch.id))
        .reduce((sum, batch) => sum + (batch.recievedWeight || 0), 0);
      form.setValue("totalOutputWeight", totalWeight.toString(), {
        shouldValidate: true,
      });
    } else {
      form.setValue("totalOutputWeight", "", { shouldValidate: true });
    }
  }, [selectedBatchIds, batches, form]);

  // Fetch exporters and processed batches
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Fetch exporters (users with role 'exporter')
        const exportersResponse = await fetch(`${API_URL}user/role/exporter`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!exportersResponse.ok) throw new Error("Failed to fetch exporters");
        const exportersData = await exportersResponse.json();
        const formattedExporters = exportersData.users.map((user: any) => ({
          id: user.id,
          companyName: user.companyName || "Unknown Company",
          location: user.location || "Unknown Location",
          email: user.email,
        }));
        setExporters(formattedExporters);

        // Fetch processed batches for the processor
        const batchesResponse = await fetch(
          `${API_URL}batches/processor/batch`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!batchesResponse.ok) throw new Error("Failed to fetch batches");
        const batchesData = await batchesResponse.json();
        // Filter for processed batches only
        const processedBatches = (batchesData || []).filter(
          (batch: Batch) => batch.status === "Processed"
        );
        setBatches(processedBatches);
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

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    const selectedBatches = batches.filter((b) => data.batchIds.includes(b.id));
    const totalWeight = selectedBatches.reduce(
      (sum, b) => sum + (b.recievedWeight || 0),
      0
    );
    const selectedExporter = exporters.find(
      (e) => e.id === data.exporterFacility
    );
    setLotData({
      exporterId: data.exporterFacility,
      exporterFacility: selectedExporter ? selectedExporter.companyName : "",
      batches: selectedBatches,
      comments: data.comments,
      totalWeight: totalWeight.toString(),
    });
    form.reset();
    handleNext();
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span>Loading data...</span>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">
          No processed batches available to create a lot.
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
          <p className="font-normal text-[#222222] text-sm">Select Batches</p>
          <FormField
            control={form.control}
            name="batchIds"
            render={({ field }) => {
              const selectedBatches: string[] = field.value || [];
              const toggleBatch = (id: string) => {
                if (selectedBatches.includes(id)) {
                  field.onChange(selectedBatches.filter((r) => r !== id));
                } else {
                  field.onChange([...selectedBatches, id]);
                }
              };
              return (
                <FormItem className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full my-2 shadow-none justify-start text-black"
                      >
                        {selectedBatches.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedBatches.map((id) => {
                              const batch = batches.find((b) => b.id === id);
                              return (
                                <span
                                  key={id}
                                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                                >
                                  {batch
                                    ? `${batch.id} (${batch.recievedWeight}kg)`
                                    : id}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          "Select batches"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search batches..." />
                        <CommandList>
                          <CommandEmpty>No batches found</CommandEmpty>
                          <ScrollArea className="h-72">
                            {batches.map((batch) => (
                              <CommandItem
                                key={batch.id}
                                onSelect={() => toggleBatch(batch.id)}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-medium">{batch.id}</div>
                                  <div className="text-xs text-gray-500">
                                    Weight: {batch.totalWeight}kg
                                  </div>
                                </div>
                                {selectedBatches.includes(batch.id) && (
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

        <FormField
          control={form.control}
          name="totalOutputWeight"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Total Lot Weight (kg)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Auto-calculated"
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
            Exporter Facility
          </p>
          <FormField
            control={form.control}
            name="exporterFacility"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full my-2 shadow-none text-black justify-start"
                      >
                        {field.value ? (
                          <div className="text-black">
                            {(() => {
                              const exporter = exporters.find(
                                (e) => e.id === field.value
                              );
                              return exporter
                                ? `${exporter.companyName} (${exporter.location})`
                                : "Select facility";
                            })()}
                          </div>
                        ) : (
                          "Select exporter facility"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search exporters..." />
                        <CommandList>
                          <CommandEmpty>No exporters found</CommandEmpty>
                          <ScrollArea className="h-72">
                            {exporters.map((exporter) => (
                              <CommandItem
                                key={exporter.id}
                                onSelect={() => field.onChange(exporter.id)}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-medium">
                                    {exporter.companyName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Location: {exporter.location}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Email: {exporter.email}
                                  </div>
                                </div>
                                {field.value === exporter.id && (
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

        <div className="col-span-2">
          <Button className="w-full" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
