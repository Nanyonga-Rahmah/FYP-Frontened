import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";

const FormSchema = z.object({
  date: z.string().min(1, { message: "Date is required." }),
  numberofbags: z.string().min(1, {
    message: "Number of bags is required.",
  }),
  comments: z.string().min(2, {
    message: "Comments are required.",
  }),
});

interface MarkDeliveredFormProps {
  batchId: string;
}

export function MarkDeliveredForm({ batchId }: MarkDeliveredFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { authToken } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: "",
      comments: "",
      numberofbags: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);

      const payload = {
        batchId: batchId,
        receivedBags: parseInt(data.numberofbags),
        dateReceived: data.date,
        receiptNotes: data.comments,
      };

      const response = await fetch(
        `${API_URL}batches/processor/mark-received`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to mark batch as delivered");
      }

      toast({
        title: "Success",
        description: "Batch has been marked as delivered successfully.",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error marking batch as delivered:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark batch as delivered",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3 px-3 py-1.5"
      >
        <FormField
          control={form.control}
          name="numberofbags"
          render={({ field }) => (
            <FormItem className="col-span-2 text-left">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Number of bags received
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="py-2.5" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="font-normal text-[#222222] text-sm">
                Date Received
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-9" />
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
              <FormLabel className="font-normal text-[#222222] text-sm">
                Notes*
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Mark Delivered"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
