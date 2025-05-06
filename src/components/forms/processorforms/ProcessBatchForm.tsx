import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/Farmers/DateRangePicker";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  processingMethod: z.string().min(1, "Processing method is required."),
  processingPeriod: z.object({
    start: z.date({ required_error: "Start date is required." }),
    end: z.date({ required_error: "End date is required." }),
  }),
  inputBags: z
    .number({ invalid_type_error: "Enter a valid number." })
    .min(1, "Input bags must be a positive number."),
  outputWeight: z
    .number({ invalid_type_error: "Enter a valid number." })
    .min(1, "Output weight must be a positive number."),
  gradingLevel: z.string().optional(),
  notes: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required."),
});

const processingMethods = [
  { value: "washed", label: "Washed (Wet) Process" },
  { value: "natural", label: "Natural (Dry) Process" },
  { value: "honey", label: "Honey Process" },
  { value: "pulped_natural", label: "Pulped Natural Process" },
];

type FormData = z.infer<typeof FormSchema>;

interface ProcessingFormProps {
  batchId: string;
}

export const ProcessingForm: React.FC<ProcessingFormProps> = ({ batchId }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      processingMethod: "",
      processingPeriod: { start: new Date(), end: new Date() },
      inputBags: 0,
      outputWeight: 0,
      gradingLevel: "",
      notes: "",
      images: [],
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  const onSubmit = async (formData: FormData) => {
    setLoading(true);

    const dataToSend = {
      batchId,
      processingMethod: formData.processingMethod,
      processingPeriod: {
        start: formData.processingPeriod.start.toISOString(),
        end: formData.processingPeriod.end.toISOString(),
      },
      gradingLevel: formData.gradingLevel,
      outputWeight: formData.outputWeight,
      notes: formData.notes,
      inputBags: formData.inputBags,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(dataToSend));
    images.forEach((image) => {
      formDataToSend.append("documents", image);
    });

    try {
      const response = await fetch(`${API_URL}batches/processor/process`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to process batch");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "Batch has been marked as processed successfully.",
      });

      console.log("Batch processed successfully:", result);
    } catch (error) {
      console.error("Error processing batch:", error);
      toast({
        title: "Error",
        description: "Failed to process the batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);
      setValue("images", fileArray);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <div>
        <label className="font-semibold">Processing Method</label>
        <Controller
          control={control}
          name="processingMethod"
          render={({ field }) => (
            <select {...field} className="w-full mt-2 border p-2">
              <option value="">Select a processing method</option>
              {processingMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.processingMethod && (
          <p className="text-red-500 text-sm mt-1">
            {errors.processingMethod.message}
          </p>
        )}
      </div>

      <div>
        <label className="font-semibold">Processing Period</label>
        <Controller
          control={control}
          name="processingPeriod"
          render={({ field }) => (
            <DateRangePicker value={field.value} onChange={field.onChange} />
          )}
        />

        {(errors.processingPeriod?.start || errors.processingPeriod?.end) && (
          <p className="text-red-500 text-sm mt-1">
            Start and End dates are required
          </p>
        )}
      </div>

      <div>
        <label className="font-semibold">Input Bags</label>
        <Controller
          control={control}
          name="inputBags"
          render={({ field }) => (
            <Input
              type="number"
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full mt-2 p-2"
              placeholder="Enter number of bags"
            />
          )}
        />

        {errors.inputBags && (
          <p className="text-red-500 text-sm mt-1">
            {errors.inputBags.message}
          </p>
        )}
      </div>

      <div>
        <label className="font-semibold">Output Weight (kg)</label>
        <Controller
          control={control}
          name="outputWeight"
          render={({ field }) => (
            <Input
              type="number"
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full mt-2 p-2"
              placeholder="Enter output weight"
            />
          )}
        />

        {errors.outputWeight && (
          <p className="text-red-500 text-sm mt-1">
            {errors.outputWeight.message}
          </p>
        )}
      </div>

      <div>
        <label className="font-semibold">Grading Level</label>
        <Controller
          control={control}
          name="gradingLevel"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full mt-2 p-2"
              placeholder="Enter grading level"
            />
          )}
        />
      </div>

      <div>
        <label className="font-semibold">Notes</label>
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Input
              {...field}
              className="w-full mt-2 p-2"
              placeholder="Enter notes"
            />
          )}
        />
      </div>

      <div>
        <label className="font-semibold">Images of Processed Coffee</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-2"
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          className="bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Save as Processed"}
        </Button>
      </div>
    </form>
  );
};
