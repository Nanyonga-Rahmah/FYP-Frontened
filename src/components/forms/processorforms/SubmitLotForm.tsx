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


const FormSchema = z.object({
  weight: z.string().min(2, {
    message: "Field is required.",
  }),

  exporterfacility: z.array(z.string()).min(1, {
    message: "Select at least one processing facility",
  }),

  batches: z
    .array(z.string())
    .min(1, { message: "Select at least one harvest" }),
  comments: z.string().min(2, {
    message: "Field is required.",
  }),
});
interface SubmitLotFormProps {
  handleNext: () => void;
  setBatchData: (data: any) => void;
}
export function SubmitLotForm({
  handleNext,
  setBatchData,
}: SubmitLotFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      weight: "",
      comments: "",
      exporterfacility: [],

      batches: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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
          <p className="font-normal text-[#222222] text-sm">Select Batches</p>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="batches"
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
                            "Select batch records"
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
            Exporter Facility
          </p>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="exporterfacility"
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
                <Textarea {...field} className="text-black" />
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
