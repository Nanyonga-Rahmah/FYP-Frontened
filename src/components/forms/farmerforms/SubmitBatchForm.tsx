import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useState } from "react";

const FormSchema = z.object({
  weight: z.string().min(2, {
    message: "Field is required.",
  }),

  processingFacility: z.array(z.string()).min(1, {
    message: "Select at least one processing facility",
  }),

  harvestRecords: z
    .array(z.string())
    .min(1, { message: "Select at least one harvest" }),
  comments: z.string().min(2, {
    message: "Field is required.",
  }),
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
});

interface SubmitBatchFormProps {
  handleNext: () => void;
  setBatchData: (data: any) => void;
}

export function SubmitBatchForm({ handleNext ,setBatchData}: SubmitBatchFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      weight: "",
      comments: "",
      processingFacility: [],

      documents: [],
      harvestRecords: [],
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
    setBatchData(data);
    handleNext();
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
              name="harvestRecords"
              render={({ field }) => {
                const selectedRecords: string[] = field.value || [];

                const toggleRecord = (record: string) => {
                  if (selectedRecords.includes(record)) {
                    field.onChange(selectedRecords.filter((r) => r !== record));
                  } else {
                    field.onChange([...selectedRecords, record]);
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
                          {selectedRecords.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedRecords.map((r) => (
                                <span
                                  key={r}
                                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                                >
                                  {r}
                                </span>
                              ))}
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
                            {[
                              "apple",
                              "banana",
                              "blueberry",
                              "grapes",
                              "pineapple",
                            ].map((record, index) => (
                              <CommandItem
                                key={index}
                                onSelect={() => toggleRecord(record)}
                              >
                                {record}
                                {selectedRecords.includes(record) && (
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
          </div>
        </div>

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Total Batch weight (kg)
              </FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} className="py-2.5" />
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
              name="processingFacility"
              render={({ field }) => {
                const selectedRecords: string[] = field.value || [];

                const toggleRecord = (record: string) => {
                  if (selectedRecords.includes(record)) {
                    field.onChange(selectedRecords.filter((r) => r !== record));
                  } else {
                    field.onChange([...selectedRecords, record]);
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
                          {selectedRecords.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedRecords.map((r) => (
                                <span
                                  key={r}
                                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "Select facility"
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search facilities..." />
                          <CommandList>
                            {[
                              "apple",
                              "banana",
                              "blueberry",
                              "grapes",
                              "pineapple",
                            ].map((record, index) => (
                              <CommandItem
                                key={index}
                                onSelect={() => toggleRecord(record)}
                              >
                                {record}
                                {selectedRecords.includes(record) && (
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
                <Textarea {...field} />
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

        <div className=" col-span-2">
          <Button className="w-full">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
