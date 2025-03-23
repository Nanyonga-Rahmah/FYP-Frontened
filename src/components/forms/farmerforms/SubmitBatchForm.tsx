import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useState } from "react";

const FormSchema = z.object({
  weight: z.string().min(2, {
    message: "Field is required.",
  }),

  harvestRecords: z.string().min(2, {
    message: "Field is required.",
  }),
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

export function SubmitBatchForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      weight: "",
      comments: "",

      documents: [],
      harvestRecords: "",
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
        className="grid grid-cols-2 gap-3 px-3 py-1.5"
      >
        <div className="col-span-2">
          <p className="font-normal text-[#070916E5] text-sm">
            Harvest Records
          </p>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="harvestRecords"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className=" my-2 shadow-none ">
                      <SelectValue
                        placeholder="Select  harvest records "
                        className=" "
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel>Total Batch weight (kg)</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} className="py-2.5" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel>Comments (Optional)</FormLabel>
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
              <FormLabel>
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

        <div className="flex items-center justify-between col-span-2">
          <Button variant={"outline"}>Save Draft</Button>
          <Button type="submit">Submit Batch</Button>
        </div>
      </form>
    </Form>
  );
}
