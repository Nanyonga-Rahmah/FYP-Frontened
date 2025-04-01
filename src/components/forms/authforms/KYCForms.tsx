import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  idPhotos: z.array(z.instanceof(File)).length(2, "You must upload both front and back ID photos"),
  passportPhoto: z.instanceof(File),
});

interface KYCProps{
    handlePrevious:()=>void;
}

export default function KYCForms({handlePrevious}:KYCProps) {
  const [preview, setPreview] = useState<{ idPhotos: string[]; passportPhoto: string | null }>({
    idPhotos: [],
    passportPhoto: null,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { idPhotos: [] as File[], passportPhoto: null as File | null },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>, fieldName: "idPhotos" | "passportPhoto") {
    const files = event.target.files;
    if (!files) return;

    if (fieldName === "idPhotos") {
      if (files.length !== 2) return alert("Please select both front and back ID photos.");
      form.setValue("idPhotos", Array.from(files));
      setPreview((prev) => ({ ...prev, idPhotos: Array.from(files).map((file) => URL.createObjectURL(file)) }));
    } else {
      form.setValue("passportPhoto", files[0]);
      setPreview((prev) => ({ ...prev, passportPhoto: URL.createObjectURL(files[0]) }));
    }
  }

  function onSubmit(values: any) {
    console.log("Form submitted", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      
        <FormField
          control={form.control}
          name="idPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Photos (Front & Back)</FormLabel>
              <FormControl>
                <Input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, "idPhotos")} />
              </FormControl>
              <FormMessage />
              <div className="flex gap-2 mt-2">
                {preview.idPhotos.map((src, index) => (
                  <img key={index} src={src} alt={`ID Photo ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
            </FormItem>
          )}
        />

       
        <FormField
          control={form.control}
          name="passportPhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passport-Sized Photo</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "passportPhoto")} />
              </FormControl>
              <FormMessage />
              {preview.passportPhoto && <img src={preview.passportPhoto} alt="Passport" className="w-20 h-20 mt-2 object-cover rounded" />}
            </FormItem>
          )}
        />

        <div className="flex justify-between">

        <Button  variant={"outline"} className="" onClick={handlePrevious}>Back</Button>

        <Button type="submit">Submit</Button>
        </div>

        
      </form>
    </Form>
  );
}
