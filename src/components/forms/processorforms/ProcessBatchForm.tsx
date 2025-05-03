import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { DateRangePicker } from '@/components/Farmers/DateRangePicker'; 

import { z } from "zod";

const FormSchema = z.object({
  processingMethod: z.string().min(1, "Processing method is required."),
  processingPeriod: z.object({
    start: z.string().min(1, "Start date is required."),
    end: z.string().min(1, "End date is required."),
  }),
  inputBags: z.number().min(1, "Input bags must be a positive number."),
  outputWeight: z.number().min(1, "Output weight must be a positive number."),
  gradingLevel: z.string().optional(),
  notes: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required."),
});

export const ProcessingForm = () => {
  const { control, handleSubmit, setValue } = useForm<{
    processingMethod: string;
    processingPeriod: { start: string; end: string };
    inputBags: number;
    outputWeight: number;
    gradingLevel: string;
    notes: string;
    images: File[];
  }>({
    defaultValues: {
      processingMethod: '',
      processingPeriod: { start: '', end: '' },
      inputBags: 0,
      outputWeight: 0,
      gradingLevel: '',
      notes: '',
      images: [],
    },
  });

  const [images, setImages] = useState<File[]>([]);

  const onSubmit = (data: z.infer<typeof FormSchema>)=> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    images.forEach((image) => {
      formData.append('images', image);
    });

    // Submit form logic here (e.g., sending formData to an API)
    console.log("Form data", formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);
      setValue('images', fileArray);
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
              <option value="">Select processing method</option>
              <option value="method1">Method 1</option>
              <option value="method2">Method 2</option>
            </select>
          )}
        />
      </div>

      <div>
        <label className="font-semibold">Processing Period</label>
        <Controller
          control={control}
          name="processingPeriod"
          render={({ field }) => (
            <DateRangePicker
              value={field.value}
              onChange={(dateRange) => field.onChange(dateRange)}
            />
          )}
        />
      </div>

      <div>
        <label className="font-semibold">Input Bags</label>
        <Controller
          control={control}
          name="inputBags"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              className="w-full mt-2 p-2"
              placeholder="Enter number of bags"
            />
          )}
        />
      </div>

      <div>
        <label className="font-semibold">Output Weight (kg)</label>
        <Controller
          control={control}
          name="outputWeight"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              className="w-full mt-2 p-2"
              placeholder="Enter output weight"
            />
          )}
        />
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
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" className="bg-blue-500 text-white">
          Save as Processed
        </Button>
      </div>
    </form>
  );
};
