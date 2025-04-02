import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, ImageIcon } from "lucide-react";
import { cooperatives } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  idPhotos: z
    .array(z.instanceof(File))
    .nonempty("At least one ID photo is required"),
  passportPhoto: z.instanceof(File).optional(),
  cooperativeSociety: z.string(),
});

interface KYCProps {
  handlePrevious: () => void;
}

export default function KYCForms({ handlePrevious }: KYCProps) {
  const [preview, setPreview] = useState<{
    idPhotos: string[];
    passportPhoto: string | null;
  }>({ idPhotos: [], passportPhoto: null });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idPhotos: [] as File[],
      passportPhoto: null as File | null,
      cooperativeSociety: "",
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    form.setValue("idPhotos", newFiles);
    setPreview((prev) => ({
      ...prev,
      idPhotos: newFiles.map((file) => URL.createObjectURL(file)),
    }));
  }

  function handlePassportChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    form.setValue("passportPhoto", files[0]);
    setPreview((prev) => ({
      ...prev,
      passportPhoto: URL.createObjectURL(files[0]),
    }));
  }

  function onSubmit(values: any) {
    console.log("Form submitted", values);
  }

  return (
    <ScrollArea className="h-[500px]">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idPhotos"
          render={() => (
            <FormItem>
              <FormLabel>ID Photos (Front and Back)</FormLabel>
              <FormControl>
                <div className="rounded-[6px] border border-dashed h-28 bg-[#C8CFDE] flex justify-center items-center">
                  <label
                    htmlFor="file-upload"
                    className="text-sm flex flex-col items-center gap-2 justify-center"
                  >
                    <ImageIcon />

                    <span className="text-primary ">
                      <span className="underline">Choose Files </span>{" "}
                      <span> to Upload</span>
                    </span>
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </FormControl>
              <FormMessage />
              <div className="flex gap-2 mt-2">
                {preview.idPhotos.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`ID Photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passportPhoto"
          render={() => (
            <FormItem>
              <FormLabel>
                Passport-size Photo (Please upload a clear passport-size photo
                of yourself.)
              </FormLabel>
              <FormControl>
                <div className="rounded-[6px] border border-dashed h-28 bg-[#C8CFDE] flex justify-center items-center">
                  <label
                    htmlFor="file-upload"
                    className="text-sm flex flex-col justify-center gap-2 items-center"
                  >
                    <ImageIcon />
                    <span className="text-primary ">
                      <span className="underline">Choose Files </span>{" "}
                      <span> to Upload</span>
                    </span>
                  </label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handlePassportChange}
                    className="hidden"
                  />
                </div>
                {/* <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePassportChange}
                /> */}
              </FormControl>
              <FormMessage />
              {preview.passportPhoto && (
                <img
                  src={preview.passportPhoto}
                  alt="Passport"
                  className="w-20 h-20 mt-2 object-cover rounded"
                />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cooperativeSociety"
          render={({ field }) => (
            <FormItem className="col-span-2 flex flex-col  text-left">
              <FormLabel className="text-[#222222]">
                Cooperative/Location
              </FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className=" justify-between"
                    >
                      {value
                        ? cooperatives.find(
                            (cooperative) => cooperative.value === value
                          )?.label
                        : "Select cooperative..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Select Cooperative/Sub-County"
                        className="h-10"
                      />
                      <CommandList>
                        <CommandEmpty>No cooperative found.</CommandEmpty>
                        <CommandGroup>
                          {cooperatives.map((cooperative) => (
                            <CommandItem
                              key={cooperative.value}
                              value={cooperative.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {cooperative.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === cooperative.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center gap-56">
          <Button variant="outline" onClick={handlePrevious} className="px-6">
            Back
          </Button>
          <Button type="submit" className="grow">Submit</Button>
        </div>
      </form>
    </Form>
    </ScrollArea>
  );
}
